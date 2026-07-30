import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import Reveal from "../components/Reveal";
import TrustBar from "../components/TrustBar";
import NewCourses from "../components/NewCourses";
import FeaturedCourses from "../components/FeaturedCourses";
import WhyChoose from "../components/WhyChoose";
import LearningJourney from "../components/LearningJourney";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import { api } from "../api";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function Home() {
  const [heroes, setHeroes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getHeroes(),
      api.getPublishedCourses(),
      api.getTestimonials(),
      api.getFAQs(),
    ]).then(([h, c, t, f]) => {
      setHeroes(h);
      setCourses(c);
      setTestimonials(t);
      setFaqs(f);
    }).catch(() => {});
  }, []);

  const homeHero = heroes.find((h) => h.id === "home");

  return (
    <>
      <header id="home" style={{ position: "relative" }}>
        <HeroCarousel pageHero={homeHero} />
      </header>
      <TrustBar />
      <NewCourses courses={courses} />
      <FeaturedCourses courses={courses} />
      <WhyChoose />
      <LearningJourney />
      <Testimonials testimonials={testimonials} />
      <FAQ faqs={faqs} />
      <FinalCTA />
    </>
  );
}
