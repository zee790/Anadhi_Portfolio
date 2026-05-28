/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  id?: string;
  name: string;
  email: string;
  linkedin: string;
  title: string;
  subtitle: string;
  bio: string;
  videoUrl: string; // YouTube/Drive/Vimeo video embed link
  videoTranscript: string; // Transcript of intro video
  techAxisTitle?: string;
  techAxisContent?: string;
  stratAxisTitle?: string;
  stratAxisContent?: string;
  commBridgerTitle?: string;
  commBridgerContent?: string;
  topBannerText?: string;
  resumeSectionTitle?: string;
  resumeSectionSubtitle?: string;
  workExperienceTitle?: string;
  academicHistoryTitle?: string;
  skillsTitle?: string;
  certificationsTitle?: string;
  documentVaultTitle?: string;
  documentVaultSubtitle?: string;
  thesisTitleCustom?: string;
  thesisSubtitleCustom?: string;
  coverLetterTitle?: string;
  coverLetterSubtitle?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  order: number;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  focus: string;
  thesisTitle?: string;
  thesisLink?: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string; // Comma separated items
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  focus: string;
  order: number;
}

export interface CoverLetter {
  id?: string;
  recipient: string;
  body: string;
}

export interface Thesis {
  id?: string;
  title: string;
  abstract: string;
  link: string;
  published: string;
  focus: string;
  commGapSolvedTitle?: string;
  commGapSolvedHeading?: string;
  commGapSolvedDescription?: string;
  commGapPointATitle?: string;
  commGapPointADesc?: string;
  commGapPointBTitle?: string;
  commGapPointBDesc?: string;
  commGapFooterTagline?: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  category: "Resume" | "Cover Letter" | "Thesis" | "Other";
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  size?: string;
}
