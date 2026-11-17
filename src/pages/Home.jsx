import CinematicHome from '../components/cine/CinematicHome.jsx';
import { Marquee, Values, Impact, Rail, Steps, CTA } from '../components/home/HomeSections.jsx';
import '../components/home/Home.css';

export default function Home() {
  return (
    <div className="home">
      <CinematicHome />
      <div className="home__solid">
        <Marquee />
        <Values />
        <Impact />
        <Rail />
        <Steps />
        <CTA />
      </div>
    </div>
  );
}
