"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building,
  CheckCircle2,
  GraduationCap,
  Layout,
  Lock,
  PlayCircle,
  Smartphone,
  Users,
  Sparkles,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
// import Hero3D from "@/components/home-page/Hero3D";
import FCard from "@/components/ui/FCard";
import FButton from "@/components/ui/FButton";
import FTypography from "@/components/ui/FTypography";
import styles from "./page.module.scss";
import { useQuery } from "@apollo/client/react";
import { GetProfileDataDocument } from "@/generated/graphql";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/enum/routes.enum";
import Navbar from "@/components/navbar/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useQuery(GetProfileDataDocument, {
    context: { public: true },
    fetchPolicy: "network-only",
  });
  const router = useRouter();
  useEffect(() => {
    if (data?.getProfileData && !loading) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [data, loading]);
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(`.${styles.navbar}`, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });

      tl.from(
        [
          `.${styles.hero} h1`,
          `.${styles.hero} .${styles.subtitle}`,
          `.${styles.heroActions}`,
        ],
        { y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.6",
      );

      gsap.to(`.${styles.blob1}`, {
        x: 80,
        y: 100,
        scale: 1.1,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(`.${styles.blob2}`, {
        x: -60,
        y: 80,
        scale: 0.9,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
      gsap.to(`.${styles.blob3}`, {
        x: 40,
        y: -60,
        scale: 1.05,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 4,
      });

      // Target .scrollReveal class for scroll animations
      const cards = gsap.utils.toArray(`.${styles.scrollReveal}`);
      cards.forEach((card) => {
        gsap.from(card as gsap.TweenTarget, {
          scrollTrigger: {
            trigger: card as gsap.DOMTarget,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          rotateX: -15,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          transformOrigin: "top center",
        });
      });

      gsap.from(`.${styles.ctaWrapper}`, {
        scrollTrigger: { trigger: `.${styles.ctaWrapper}`, start: "top 80%" },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <>
      <Navbar />
      <div className={styles.page} ref={containerRef}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
        <div className={styles.gridOverlay} />

        <main className={styles.main}>
          {/* 2️⃣ Hero Section */}
          <section className={styles.hero}>
            {/* <Hero3D /> */}
            <div className={styles.heroContent}>
              <FTypography variant="h1" align="center">
                Smart Learning.
                <br />
                <FTypography gradient>Beautifully Organized.</FTypography>
              </FTypography>
              <FTypography
                variant="body"
                className={styles.subtitle}
                align="center"
              >
                A premium LMS for teachers and students to create, manage, and
                experience modern education.
              </FTypography>
              <div className={styles.heroActions}>
                <FButton onClick={() => router.push(ROUTES.SIGNUP)}>
                  Start Learning
                  <ArrowRight size={20} />
                </FButton>
                <FButton
                  variant="secondary"
                  onClick={() => router.push(ROUTES.LOGIN)}
                >
                  For Teachers
                </FButton>
              </div>
            </div>
          </section>

          {/* 3️⃣ User Role Cards */}
          <section id="roles" className={styles.roleSection}>
            <div className={styles.roleGrid}>
              <div className={styles.scrollReveal}>
                <FCard animate3d={true}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <GraduationCap size={28} />
                    </div>
                    <h3>For Students</h3>
                  </div>
                  <ul className={styles.cardList}>
                    <li>Courses</li>
                    <li>Lessons</li>
                    <li>Tests</li>
                    <li>Progress</li>
                    <li>Certificates</li>
                  </ul>
                </FCard>
              </div>

              <div className={styles.scrollReveal}>
                <FCard animate3d={true}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <Users size={28} />
                    </div>
                    <h3>For Teachers</h3>
                  </div>
                  <ul className={styles.cardList}>
                    <li>Create courses</li>
                    <li>Upload lessons</li>
                    <li>Assign work</li>
                    <li>Track students</li>
                    <li>Analytics</li>
                  </ul>
                </FCard>
              </div>

              <div className={styles.scrollReveal}>
                <FCard animate3d={true}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <Building size={28} />
                    </div>
                    <h3>For Institutions</h3>
                  </div>
                  <ul className={styles.cardList}>
                    <li>Admin Dashboard</li>
                    <li>User Management</li>
                    <li>Global Analytics</li>
                    <li>Custom Branding</li>
                    <li>Scalable Infra</li>
                  </ul>
                </FCard>
              </div>
            </div>
          </section>

          {/* 4️⃣ Feature Grid */}
          <section id="features" className={styles.features}>
            <div className={styles.featureGrid}>
              <FeatureTile icon={<Layout />} title="Course Management" />
              <FeatureTile icon={<PlayCircle />} title="Video Lessons" />
              <FeatureTile icon={<BookOpen />} title="Assignments" />
              <FeatureTile icon={<CheckCircle2 />} title="Quizzes" />
              <FeatureTile icon={<BarChart3 />} title="Analytics" />
              <FeatureTile icon={<Lock />} title="Secure Login" />
              <FeatureTile icon={<Award />} title="Certificates" />
              <FeatureTile icon={<Smartphone />} title="Mobile Friendly" />
            </div>
          </section>

          {/* 5️⃣ CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaWrapper}>
              <FCard animate3d={true} glass={true} className={styles.ctaCard}>
                <div className={styles.ctaContent}>
                  <FTypography variant="h2" align="center">
                    Start your learning journey today
                  </FTypography>
                  <div className={styles.ctaActions}>
                    <FButton onClick={() => (window.location.href = "/login")}>
                      Login
                    </FButton>
                    <FButton onClick={() => (window.location.href = "/signup")}>
                      Sign Up
                    </FButton>
                  </div>
                </div>
              </FCard>
            </div>
          </section>

          {/* 6️⃣ Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Sparkles size={20} />
                </div>
                <span>Nexus</span>
              </div>
              <div className={styles.footerLinks}>
                <Link href="/features">Features</Link>
                <Link href="/students">For Students</Link>
                <Link href="/teachers">For Teachers</Link>
              </div>
              <p>© 2026 Nexus LMS</p>
            </div>
          </footer>
        </main>
      </div >
    </>
  );
}

function FeatureTile({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className={styles.scrollReveal}>
      <FCard animate3d={true} className={styles.featureTile}>
        <div className={styles.iconWrapper}>{icon}</div>
        <h4>{title}</h4>
      </FCard>
    </div>
  );
}
