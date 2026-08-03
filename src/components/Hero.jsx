import './Hero.css';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Hero = ({ data }) => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="greeting">Hi there, I'm</p>
          <h1 className="name">{data.name}</h1>
          <h2 className="tagline">{data.tagline}</h2>
          <p className="description">{data.description}</p>
          
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
          </div>

          <div className="social-links">
            <a href={data.github} target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href={data.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href={data.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href={`mailto:${data.email}`}><FaEnvelope /></a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image glass-panel">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" alt={data.name} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
