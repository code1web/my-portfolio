import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contact';
import portfolioData from '../data/portfolio.json';

function Portfolio() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(portfolioData);
  }, []);

  if (!data) return null;

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <Navbar />
      
      <main>
        <Hero data={data.personalInfo} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Contact email={data.personalInfo.email} />
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <p>&copy; {new Date().getFullYear()} {data.personalInfo.name}. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Portfolio;
