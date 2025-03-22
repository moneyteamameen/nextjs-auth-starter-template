import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { LearnMore } from "./components/learn-more"
import screenshotDevices from "./images/user-button@2xrl.webp"
import signIn from "./images/sign-in@2xrl.webp"
import verify from "./images/verify@2xrl.webp"
import userButton2 from "./images/user-button-2@2xrl.webp"
import signUp from "./images/sign-up@2xrl.webp"
import logo from "./images/logo.png"
import "./home.css"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, HardHat, FileText, BarChart4, PanelTop, ChevronRight } from "lucide-react"

import { CARDS } from "./consts/cards"
import { ClerkLogo } from "./components/clerk-logo"
import { NextLogo } from "./components/next-logo"

export default function Home() {
  return (
    <main className="bg-background-primary text-text-primary">
      {/* Hero Section */}
      <section className="bg-background-primary border-b border-border-dark">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2">
          {/* Left column */}
          <div className="bg-yellow-accent p-10 md:p-16 lg:p-20 text-background-primary">
            <div className="mb-4 font-bold">CONS</div>
            <div className="text-sm font-medium mb-6">••CONSTRUCTION INSIGHTHUB••</div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Let's realize<br />
              your best building<br />
              construction
            </h1>
            
            <p className="mb-10 max-w-md">
              Turn your construction dreams into reality with our expert team; we'll ensure everything comes together perfectly, delivering quality you can count on every project.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up" className="bg-background-primary text-yellow-accent px-6 py-3 font-bold inline-flex items-center">
                Get Started <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link href="/about" className="border border-background-primary text-background-primary px-6 py-3 font-bold inline-flex items-center">
                Watch Video
              </Link>
            </div>
          </div>
          
          {/* Right column with image */}
          <div className="bg-background-secondary relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Placeholder for construction worker image */}
              <div className="relative w-full h-full bg-background-secondary">
                {/* This would be an actual image in production */}
                <div className="absolute bottom-0 right-0 bg-yellow-accent text-background-primary p-3 w-48">
                  <div className="text-sm mb-1">STAR RATING</div>
                  <div className="flex items-center">
                    ★★★★★
                  </div>
                </div>
                <div className="absolute top-0 right-0 bg-yellow-accent text-background-primary p-3 m-8">
                  <Link href="/sign-in" className="font-bold">
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-[90rem] mx-auto">
          <div className="mb-4 font-bold text-sm">• ABOUT US •</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                Crafting your vision. Turning innovative ideas into lasting & sustainable structures, with years of expertise and unwavering precision in the construction
              </h2>
            </div>
            
            <div>
              <p className="text-text-secondary mb-12">
                At Construction InsightHub, we leverage AI-powered technology to transform how construction documentation is processed and analyzed. Our platform offers document analysis, construction insights, and automated reporting to help construction professionals make informed decisions and streamline their workflows.
              </p>
              
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-accent-primary mb-2">4.9</div>
                  <div className="text-sm text-text-secondary">Client Rating</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent-primary mb-2">850+</div>
                  <div className="text-sm text-text-secondary">Projects Done</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent-primary mb-2">$5.87B</div>
                  <div className="text-sm text-text-secondary">Total Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-24 px-6 bg-background-primary relative">
        <div className="max-w-[90rem] mx-auto relative">
          <div className="absolute top-0 right-0">
            <div className="flex flex-col items-end">
              <div className="w-24 h-24 bg-accent-primary"></div>
              <div className="w-12 h-12 bg-white"></div>
            </div>
          </div>
          
          <div className="mb-16">
            <div className="mb-4 font-bold text-sm">• OUR SERVICES •</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-2 bg-card-dark p-10">
              <div className="mb-6 font-bold text-lg md:text-2xl">Project Management <span className="text-accent-primary">(14)</span></div>
              <hr className="border-border-dark mb-6" />
              <p className="text-text-secondary mb-6">
                Coordinating all aspects of construction projects from inception to completion, ensuring timelines and budgets are met.
              </p>
              <Link href="/services/project-management" className="text-accent-primary font-bold inline-flex items-center hover:underline">
                Learn More <ChevronRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="col-span-2 bg-card-dark p-10">
              <div className="mb-6 font-bold text-lg md:text-2xl">Innovation Services <span className="text-accent-primary">(09)</span></div>
              <hr className="border-border-dark mb-6" />
              <p className="text-text-secondary mb-6">
                Implementing cutting-edge technologies and methodologies to enhance construction efficiency and outcomes.
              </p>
              <Link href="/services/innovation" className="text-accent-primary font-bold inline-flex items-center hover:underline">
                Learn More <ChevronRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="col-span-2 bg-card-dark p-10">
              <div className="mb-6 font-bold text-lg md:text-2xl">General Contracting <span className="text-accent-primary">(23)</span></div>
              <hr className="border-border-dark mb-6" />
              <p className="text-text-secondary mb-6">
                Providing comprehensive construction services from foundation to finishing touches with expert craftsmanship.
              </p>
              <Link href="/services/contracting" className="text-accent-primary font-bold inline-flex items-center hover:underline">
                Learn More <ChevronRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="col-span-2 bg-card-dark p-10">
              <div className="mb-6 font-bold text-lg md:text-2xl">Design and Build <span className="text-accent-primary">(18)</span></div>
              <hr className="border-border-dark mb-6" />
              <p className="text-text-secondary mb-6">
                Unified approach to architecture and construction, streamlining the process from concept to completion.
              </p>
              <Link href="/services/design-build" className="text-accent-primary font-bold inline-flex items-center hover:underline">
                Learn More <ChevronRight className="ml-1" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-[90rem] mx-auto">
          <div className="mb-16">
            <div className="mb-4 font-bold text-sm">• OUR PROJECTS •</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Building excellence through<br />
              every project we deliver
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="col-span-2">
              {/* Placeholder for project image */}
              <div className="aspect-[4/3] bg-gray-800 mb-6"></div>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-xs text-text-secondary">#CONSTRUCTION WORKS</span>
                <span className="text-xs text-text-secondary">#INTERIOR</span>
                <span className="text-xs text-text-secondary">#MATERIAL</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Construction of many luxury hotel buildings in Jakarta</h3>
            </div>
            
            <div>
              {/* Placeholder for project image */}
              <div className="aspect-[1/1] bg-gray-800 mb-6"></div>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-xs text-text-secondary">#EDUCATION BUILDS</span>
                <span className="text-xs text-text-secondary">#PUBLIC</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Construction of school buildings in East Nusa Tenggara</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24 px-6 bg-background-primary">
        <div className="max-w-[90rem] mx-auto">
          <div className="mb-16">
            <div className="mb-4 font-bold text-sm">• OUR TEAM •</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Meet the experts behind<br />
              building your vision
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card-dark overflow-hidden">
              <div className="aspect-[4/5] bg-gray-800"></div>
              <div className="p-6">
                <h3 className="font-bold mb-1">JACOB M. ARTHUR</h3>
                <p className="text-text-secondary text-sm">Chief Engineer</p>
              </div>
            </div>
            
            <div className="bg-card-dark overflow-hidden">
              <div className="aspect-[4/5] bg-gray-800"></div>
              <div className="p-6">
                <h3 className="font-bold mb-1">ESTHER HOWARD</h3>
                <p className="text-text-secondary text-sm">Project Manager</p>
              </div>
            </div>
            
            <div className="bg-card-dark overflow-hidden">
              <div className="aspect-[4/5] bg-gray-800"></div>
              <div className="p-6">
                <h3 className="font-bold mb-1">JENNY WILSON</h3>
                <p className="text-text-secondary text-sm">Head of QA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 font-bold text-sm">• LOOKING FOR THE BEST CONSTRUCTION? •</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Let's work with<br />
                us and get the best<br />
                results from us
              </h2>
            </div>
            
            <div className="flex items-end">
              <div>
                <div className="mb-8">
                  <p className="text-text-secondary">
                    Join construction professionals who are streamlining their document workflows with Construction InsightHub. Start your free trial today.
                  </p>
                </div>
                
                <Link href="/sign-up" className="bg-accent-primary text-background-primary px-6 py-3 font-bold inline-flex items-center">
                  DETAIL <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-background-primary border-t border-border-dark">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="mb-6">
                <div className="bg-accent-primary text-background-primary px-3 py-2 font-bold inline-block">
                  CONS
                </div>
              </div>
              <p className="text-text-secondary max-w-md mb-8">
                Advanced construction document processing and analysis platform for construction professionals.
              </p>
              
              <div className="space-y-3">
                <div className="text-text-secondary">
                  <span className="block font-bold text-text-primary">Address</span>
                  2118 THORNRIDGE CIR. SYRACUSE, CONNECTICUT 35624
                </div>
                <div className="text-text-secondary">
                  <span className="block font-bold text-text-primary">Email</span>
                  HELLO@CONS.ID
                </div>
                <div className="text-text-secondary">
                  <span className="block font-bold text-text-primary">Phone Number</span>
                  (219) 555-0114
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-6">Instagram</h3>
                <div className="text-text-secondary">@CONS_AGENCY</div>
              </div>
              <div>
                <h3 className="font-bold mb-6">LinkedIn</h3>
                <div className="text-text-secondary">@CONSAGENCY</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border-dark pt-6 flex flex-col md:flex-row justify-between">
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} CONS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-text-secondary text-sm hover:text-accent-primary">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-text-secondary text-sm hover:text-accent-primary">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
