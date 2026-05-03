import { Metadata } from "next";
import FuqaroClient from "./FuqaroClient";

export const metadata: Metadata = {
  title: "Qarzdorlik holatini tekshirish | Yoshlar Ittifoqi",
  description: "JSHSHIR orqali qarzdorlik holatini tekshirish portali",
};

export default function FuqaroPage() {
  return <FuqaroClient />;
}
