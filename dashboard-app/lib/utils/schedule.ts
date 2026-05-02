export interface ScheduleItem {
  monthIndex: number;
  date: Date;
  principal: number;
  interest: number;
  total: number;
  paid: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  remainingPrincipal: number;
}

export function generateSchedule(
  loanAmount: number,
  loanType: string,
  startDateRaw: Date | string | null,
  actualPayments: { summa: number; tolovSana: Date | string }[]
): ScheduleItem[] {
  if (!loanAmount || !startDateRaw) return [];
  
  const startDate = new Date(startDateRaw);
  const schedule: ScheduleItem[] = [];
  const is20Years = loanType === '20_yil';
  const months = is20Years ? 240 : 84;
  const annualInterestRate = is20Years ? 0 : 0.07; // 7% for 7 years
  
  let remainingPrincipal = loanAmount;
  let currentPaymentDate = new Date(startDate);
  
  // Calculate fixed principal per month
  const fixedPrincipalRaw = loanAmount / months;
  const fixedPrincipal = Math.floor(fixedPrincipalRaw * 100) / 100;
  
  const firstMonthPrincipal = loanAmount - (fixedPrincipal * (months - 1));
  
  for (let i = 1; i <= months; i++) {
    // Add 1 month
    currentPaymentDate = new Date(currentPaymentDate);
    currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
    
    const isFirstMonth = i === 1;
    const principalForMonth = isFirstMonth ? firstMonthPrincipal : fixedPrincipal;
    
    const interestForMonth = remainingPrincipal * (annualInterestRate / 12);
    const totalForMonth = principalForMonth + interestForMonth;
    
    schedule.push({
      monthIndex: i,
      date: new Date(currentPaymentDate),
      principal: Math.round(principalForMonth * 100) / 100,
      interest: Math.round(interestForMonth * 100) / 100,
      total: Math.round(totalForMonth * 100) / 100,
      paid: 0,
      status: 'pending',
      remainingPrincipal: Math.round((remainingPrincipal - principalForMonth) * 100) / 100,
    });
    
    remainingPrincipal -= principalForMonth;
  }
  
  // Apply actual payments
  const sortedPayments = [...actualPayments]
    .map(p => ({ ...p, tolovSana: new Date(p.tolovSana) }))
    .sort((a, b) => a.tolovSana.getTime() - b.tolovSana.getTime());
  
  let currentScheduleIndex = 0;
  for (const payment of sortedPayments) {
    let unallocatedAmount = payment.summa;
    
    while (unallocatedAmount > 0 && currentScheduleIndex < schedule.length) {
      const currentMonth = schedule[currentScheduleIndex];
      const remainingForThisMonth = currentMonth.total - currentMonth.paid;
      
      if (remainingForThisMonth <= 0) {
        currentScheduleIndex++;
        continue;
      }
      
      // Allow minor 1 tiyin errors
      if (unallocatedAmount >= remainingForThisMonth - 0.05) {
        currentMonth.paid += remainingForThisMonth;
        unallocatedAmount -= remainingForThisMonth;
        currentScheduleIndex++;
      } else {
        currentMonth.paid += unallocatedAmount;
        unallocatedAmount = 0;
      }
    }
  }
  
  // Determine status for all months
  const now = new Date();
  for (const month of schedule) {
    const isPaid = month.total - month.paid <= 0.05; // 5 tiyin tolerance
    
    if (isPaid) {
      month.status = 'paid';
    } else if (month.paid > 0) {
      // Partial payment, but is it overdue?
      if (now > month.date && now.getMonth() > month.date.getMonth() && now.getFullYear() >= month.date.getFullYear()) {
         month.status = 'overdue'; // Even partially paid, if deadline passed it's overdue
      } else {
         month.status = 'partial';
      }
    } else if (now > month.date && (now.getMonth() > month.date.getMonth() || now.getFullYear() > month.date.getFullYear())) {
      month.status = 'overdue';
    } else {
      month.status = 'pending';
    }
  }
  
  return schedule;
}
