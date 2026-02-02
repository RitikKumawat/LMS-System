import React from 'react'
import styles from "./index.module.scss";
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Sparkles size={20} /></div>
          <span>Nexus</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="#features">Features</Link>
          <Link href="#students">For Students</Link>
          <Link href="#teachers">For Teachers</Link>
          <Link href={"/courses"}>Courses</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.btnGhost}>Login</Link>
          <Link href="/signup" className={styles.btnPrimary}>Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar