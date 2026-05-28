/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile, Experience, Education, SkillCategory, Certification, CoverLetter, Thesis, DocumentAttachment } from "./types";

export const initialProfile: Profile = {
  name: "Anadhi Sharma",
  email: "asharma9albs@gmail.com",
  linkedin: "https://linkedin.com/in/anadhi-sharma-54221a257",
  title: "Climate Economics & Sustainability Specialist",
  subtitle: "Bridging the gap between Atmospheric Science (Technical) and Market-Driven ROI (Business)",
  bio: "Experienced professional with a solid technical foundation in Physics and Atmospheric Sciences, combined with client-facing startup operations, market intelligence, and ESG advisory. Recognized for bridging the communication gap between research and corporate finance directly to drive climate-aligned growth.",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default video embed, customizable
  videoTranscript: "Welcome to my introduction video! My name is Anadhi and I work as a founder's associate for a sustainability startup called NoCarbon.ai based in London.\n\nBut before we get into my experience, let's talk about my education journey. I started with my bachelors in physics and that's when I got really into the climate change problem. For my bachelors, I focused on the climate technology part and how energy systems work in real-world, like the physics. And then for my masters, I switched into atmospheric science because I wanted to look at not just the small intricate parts, but the big problem, like how does energy enter our atmosphere, how does it interact with the greenhouse gases, how does temperature shape climate, paleoclimatology. Oh my god, that was amazing, that was really interesting.\n\nSo when I was done with that part of my education, I had the opportunity to join the startup where I am in a client-facing role. Listening to these incredibly talented professionals from different industries, from finance, retail, manufacturing, I got to know that climate change is fundamentally an economics problem.\n\nSo if you are looking for someone who has experience in both the technical side and the business side, I am your guy. I have been in this space understanding the problem of climate change for the past six years, and I look forward to working on it in the future, so yeah, I am just excited to be here, and thank you for listening and watching me talk.",
  techAxisTitle: "01 . TECHNICAL SCIENTIFIC AXIS",
  techAxisContent: "Expert in Atmospheric modeling, physical energy equations, and complex deep learning structures like Convolutional Neural Networks on climate data gaps.",
  stratAxisTitle: "02 . STRATEGIC BUSINESS AXIS",
  stratAxisContent: "Pioneered 300+ client advising operations, engineered custom regulatory systems triggers (CSRD, CDP, Scope 3), and framed ROI modeling in climate economics.",
  commBridgerTitle: "Communication Bridger",
  commBridgerContent: "Climate change is fundamentally an economic problem. Profit runs the market. If we can't demonstrate real ROI, sustainability won't scale.",
  topBannerText: "Bridging Scientific Systems & Financial Viability (6 Years Experience)",
  resumeSectionTitle: "Executive Resume & Background",
  resumeSectionSubtitle: "CHOOSE SECTION TO EXPLORE REAL-TIME OR MODIFY DATASETS",
  workExperienceTitle: "Professional Work Experience",
  academicHistoryTitle: "Academic Credentials & History",
  skillsTitle: "Technical Systems & Skills Inventory",
  certificationsTitle: "Professional Specializations & Certifications",
  documentVaultTitle: "Executive Document & Attachment Vault",
  documentVaultSubtitle: "Secure attachment repository for Resumes, Cover Letters, Thesis Manuscripts, & Briefs",
  thesisTitleCustom: "Machine Learning Thesis & Research",
  thesisSubtitleCustom: "ATMOSPHERIC MODELING & CONVOLUTIONAL CLASSIFICATION",
  coverLetterTitle: "Corporate Cover Letter",
  coverLetterSubtitle: "CUSTOM TAILORED VALUE-PROPOSITION STORY"
};

export const initialExperiences: Experience[] = [
  {
    id: "exp-1",
    role: "Founder's Associate",
    company: "NoCarbon.ai",
    location: "Remote",
    period: "Dec 2025 - Present",
    points: [
      "Engaged 293 qualified client conversations across Europe and the US, identifying pain points that directly shaped product strategy and ICP focus.",
      "Conducted ongoing primary research to map ESG points (CSRD, CDP, Scope 3) across finance, construction, renewable and manufacturing sectors, informing founder-led strategy and positioning.",
      "Lead brand narrative and media outreach, including the 'Carbon in Real Life' editorial series, positioning NoCarbon.ai as a thought leader, explaining complex concepts to diverse audiences.",
      "Built AI-assisted workflows to analyze client discussions and support relationship building through multiple channels of communication."
    ],
    order: 1
  },
  {
    id: "exp-2",
    role: "Research Analyst",
    company: "NoCarbon.ai",
    location: "Remote",
    period: "Aug 2025 - Dec 2025",
    points: [
      "Laid the foundation for company's outbound research function from zero, executing market research phases 1.0-5.0 using Reddit-based market insights, CSRD/CDP regulatory data, and LinkedIn to identify data gaps.",
      "Developed prompt engineered market research algorithms to detect buying intent and market signals across 10+ verticals.",
      "Engaged 3,000+ sustainability professionals via email targeted outreach; verified and maintained 1,500+ leads in CRM pipelines and refined outreach KPIs for higher signal-to-noise engagement."
    ],
    order: 2
  },
  {
    id: "exp-3",
    role: "Research Support Specialist",
    company: "The Research Foundation for SUNY",
    location: "Albany, NY",
    period: "Jan - Mar 2024",
    points: [
      "Analysed 100+ papers on AI in climate informatics, focusing on generative and deep learning approaches for weather forecasting.",
      "Summarized research findings on how AI supports climate adaptation, agriculture, and extreme weather planning."
    ],
    order: 3
  }
];

export const initialEducation: Education[] = [
  {
    id: "edu-1",
    degree: "Masters in Atmospheric Sciences and Meteorology",
    school: "University at Albany, State University of New York",
    period: "Aug 2022 - June 2025",
    focus: "Applied Data Analysis, Advanced Geophysical Data Analysis, Sustainable Energy.",
    thesisTitle: "Using Convolutional Neural Networks to Identify Rare Weather Events: Application to Kona Low Classifications with Large-Scale Wind Pattern",
    thesisLink: "https://scholarsarchive.library.albany.edu/etd/107",
    order: 1
  },
  {
    id: "edu-2",
    degree: "Bachelors in Physics (First Class with Distinction)",
    school: "Birla Institute of Technology, Mesra",
    period: "Jul 2019 - Jun 2022",
    focus: "Climate technology, physics of energy systems",
    order: 2
  }
];

export const initialSkills: SkillCategory[] = [
  {
    id: "skill-1",
    category: "Outreach & CRM",
    items: "Sales Navigator, LinkedIn Messaging, Octopus CRM, Engage Bay, Notion, Trello, Excel",
    order: 1
  },
  {
    id: "skill-2",
    category: "Data & Enrichment",
    items: "Clay, Apify, Bouncer",
    order: 2
  },
  {
    id: "skill-3",
    category: "Market Research & Intelligence",
    items: "Google NotebookLM, Prompt-Engineered Market Research Algorithms (ChatGPT, Perplexity, Gemini)",
    order: 3
  },
  {
    id: "skill-4",
    category: "Data Science & Analytics",
    items: "Python, Regression Models, Convolutional Neural Networks (CNNs)",
    order: 4
  },
  {
    id: "skill-5",
    category: "Other",
    items: "Analytical writing, Storytelling, Cross-functional collaboration, Project execution, Presentation",
    order: 5
  }
];

export const initialCertifications: Certification[] = [
  {
    id: "cert-1",
    title: "Climate Change and Sustainable Investing Specialization",
    issuer: "EDHEC Business School",
    date: "Issued May 2026",
    focus: "Climate Change Mitigation, Environmental Policy, ESG, Energy and Utilities, Sustainable Engineering, Economics, Finance, Financial Markets, Investment Management, Portfolio Management, Portfolio Risk Analysis, Project Finance, Securities (Finance)",
    description: "The program starts with the physics of climate change, moves into the economics and policies behind transitioning to a low carbon economy, and then gets into the finance side, how climate risks shape company performance and what building efficient low carbon investment strategies looks like in practice.",
    order: 1
  }
];

export const initialCoverLetter: CoverLetter = {
  recipient: "Dear Hiring manager,",
  body: `I didn’t end up in sustainability by accident. It started during my physics degree, where climate change became the problem I couldn’t stop thinking about. The sheer scale of it was overwhelming but that’s why I was drawn to it. I wanted to understand the scope of it, so when I got the opportunity, I moved to New York to pursue a masters in atmospheric science at SUNY Albany. There I built models to predict extreme weather events (Kona lows), rare storms that most models ignored because they were statistically inconvenient. That taught me early on that the hardest problems are the ones the conventional path refuses to look at.

After graduating, I found myself in a scarce sustainability job market. Trump's return had shifted the political mood around climate policy and ESG was under fire, the opportunities I was actually interested in were drying up. I received offers in technical roles, sales, and marketing but I wasn’t willing to take just any job. I had spent years building towards understanding climate change and I didn’t want to compromise that for convenience. So, I moved back to India and kept applying, only for roles that meant something to me, and eventually joined nocarbon.ai, a startup based in London, where I have spent a year in a client facing role working with people across Europe and the US.

Those conversations changed something for me. I came in with strong technical foundations but talking to people navigating this transition on the ground made one thing very clear: climate change is fundamentally an economic problem. People care about sustainability but not enough to act without the right financial incentives. Profit runs the market and if sustainability can’t demonstrate real ROI, it doesn’t scale. No amount of idealism fixes that. Along the way I also developed a deep interest in business psychology, because understanding why organizations behave the way they do around capital and change is just as important as understanding the science behind why they need to. That’s what pushed me toward climate economics, not away from what I believe in, but deeper into how the finance shapes the climate.

I am not switching directions. I am following the problem to where it gets solved.

Most people in this space come from either the science or the business side. I have lived both and spent the time in between listening to the people actually making the decisions. That’s not a background I built on purpose, it’s just what happens when you refuse to look away from a problem long enough.

Cheers,
Anadhi`
};

export const initialThesis: Thesis = {
  title: "Using Convolutional Neural Networks to Identify Rare Weather Events: Application to Kona Low Classifications with Large-Scale Wind Pattern",
  abstract: "Kona lows are subtropical cyclones that represent extreme weather hazards in the Hawaiian Islands. Standard meteorological climate forecasting models frequently overlook or misclassify them because they are statistically rare and inconvenient for standard global climate simulations. This thesis develops and applies custom deep learning architectures, specifically Convolutional Neural Networks (CNNs), to identify and classify Kona lows by analyzing large-scale wind patterns. By integrating machine learning with traditional physical dynamics, we establish a robust pathway to forecast severe rare-event storms, demonstrating how machine learning can resolve data representation gaps in legacy climate forecasting frameworks.",
  link: "https://scholarsarchive.library.albany.edu/etd/107",
  published: "Published by University at Albany, SUNY (June 2025)",
  focus: "Deep Learning (CNNs), Atmospheric Informatics, Extreme Weather Predictions, Kona Low Systems",
  commGapSolvedTitle: "Communication Gap Solved",
  commGapSolvedHeading: "How This Experience Solves Corporate Client Bottlenecks",
  commGapSolvedDescription: "Most candidates are either pure atmospheric mathematicians who can't speak with a fund manager, or corporate relations advocates who don't understand convective vortexes or deep learning architecture constraints.",
  commGapPointATitle: "Deep Learning Fluency",
  commGapPointADesc: "Able to analyze regression parameters, evaluate convolutional neural networks, and prompt engineer custom algorithms.",
  commGapPointBTitle: "Commercial Advisory",
  commGapPointBDesc: "Executed 290+ corporate ESG discussions. Translates Net-Zero compliance reports into investor margins directly.",
  commGapFooterTagline: "Dually-Qualified Science & Advisory"
};

export const initialDocuments: DocumentAttachment[] = [
  {
    id: "doc-1",
    name: "Anadhi_Sharma_Resume.pdf",
    category: "Resume",
    fileUrl: "https://scholarsarchive.library.albany.edu/etd/107",
    fileType: "application/pdf",
    uploadedAt: "2026-05-24T12:00:00Z",
    size: "142 KB"
  },
  {
    id: "doc-2",
    name: "Anadhi_Sharma_Thesis_CNN_Wind.pdf",
    category: "Thesis",
    fileUrl: "https://scholarsarchive.library.albany.edu/etd/107",
    fileType: "application/pdf",
    uploadedAt: "2026-05-25T14:30:00Z",
    size: "15.4 MB"
  },
  {
    id: "doc-3",
    name: "Anadhi_Sharma_Cover_Letter_ESG.pdf",
    category: "Cover Letter",
    fileUrl: "https://scholarsarchive.library.albany.edu/etd/107",
    fileType: "application/pdf",
    uploadedAt: "2026-05-26T09:15:00Z",
    size: "95 KB"
  }
];
