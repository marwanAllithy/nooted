import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import Editor from "@/components/editor";

type Props = Omit<ImageProps, "src"> & {
 srcLight: string;
 srcDark: string;
};

export default function Home() {
 return (
  <div className={styles.page}>
   <Editor />
  </div>
 );
}
