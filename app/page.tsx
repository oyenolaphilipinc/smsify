import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Benefits } from '@/components/benefits';
import { RegisterSteps } from '@/components/register-steps';
import { Testimonials } from '@/components/testimonials';
import { SignUp } from '@/components/sign-up';
import { FAQ } from '@/components/faq';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <RegisterSteps />
      <Testimonials />
      <SignUp />
      <FAQ />
      <Footer />
    </main>
  );
}
