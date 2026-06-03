/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth, isFirebaseConfigured, loginWithGoogle, logout } from "../firebase";
import { 
  Profile, 
  Experience, 
  Education, 
  SkillCategory, 
  Certification, 
  CoverLetter, 
  Thesis,
  DocumentAttachment,
  Project
} from "../types";
import { 
  initialProfile, 
  initialExperiences, 
  initialEducation, 
  initialSkills, 
  initialCertifications, 
  initialCoverLetter, 
  initialThesis,
  initialDocuments,
  initialProjects
} from "../initialData";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface PortfolioContextType {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: Certification[];
  coverLetter: CoverLetter;
  thesis: Thesis;
  documents: DocumentAttachment[];
  projects: Project[];
  isLoading: boolean;
  
  // Auth state
  user: User | null;
  isAdmin: boolean;         // Actually Anadhi (logged in via Google with his real email asharma9albs@gmail.com)
  isSandboxMode: boolean;   // Guest/recruiter sandbox preview mode
  isFirebaseActive: boolean;
  
  // Actions
  toggleSandboxMode: (active: boolean) => void;
  triggerGoogleLogin: () => Promise<void>;
  triggerLogout: () => Promise<void>;
  
  // CV Mutations
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateCoverLetter: (letter: Partial<CoverLetter>) => Promise<void>;
  updateThesis: (thesis: Partial<Thesis>) => Promise<void>;
  
  saveExperience: (exp: Experience) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  
  saveEducation: (edu: Education) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  
  saveSkillCategory: (skill: SkillCategory) => Promise<void>;
  deleteSkillCategory: (id: string) => Promise<void>;
  
  saveCertification: (cert: Certification) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;

  saveDocument: (doc: DocumentAttachment) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  saveProject: (proj: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  resetToDefaults: () => void;
  syncSandboxToFirestore: () => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(isFirebaseConfigured);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedKeys, setLoadedKeys] = useState<Record<string, boolean>>({});

  const markLoaded = (key: string) => {
    setLoadedKeys((prev) => {
      const next = { ...prev, [key]: true };
      if (Object.keys(next).length >= 9) {
        setIsLoading(false);
      }
      return next;
    });
  };

  // Core portfolio state
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [coverLetter, setCoverLetter] = useState<CoverLetter>(initialCoverLetter);
  const [thesis, setThesis] = useState<Thesis>(initialThesis);
  const [documents, setDocuments] = useState<DocumentAttachment[]>(initialDocuments);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Keep Refs of states to avoid stale closure references in async saves / sync procedures
  const profileRef = useRef<Profile>(profile);
  const experiencesRef = useRef<Experience[]>(experiences);
  const educationRef = useRef<Education[]>(education);
  const skillsRef = useRef<SkillCategory[]>(skills);
  const certificationsRef = useRef<Certification[]>(certifications);
  const coverLetterRef = useRef<CoverLetter>(coverLetter);
  const thesisRef = useRef<Thesis>(thesis);
  const documentsRef = useRef<DocumentAttachment[]>(documents);
  const projectsRef = useRef<Project[]>(projects);

  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { experiencesRef.current = experiences; }, [experiences]);
  useEffect(() => { educationRef.current = education; }, [education]);
  useEffect(() => { skillsRef.current = skills; }, [skills]);
  useEffect(() => { certificationsRef.current = certifications; }, [certifications]);
  useEffect(() => { coverLetterRef.current = coverLetter; }, [coverLetter]);
  useEffect(() => { thesisRef.current = thesis; }, [thesis]);
  useEffect(() => { documentsRef.current = documents; }, [documents]);
  useEffect(() => { projectsRef.current = projects; }, [projects]);

  // Detect genuine admin (Anadhi's email can be configured in admin rules)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Sync auth updates
  useEffect(() => {
    if (!isFirebaseActive || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === "asharma9albs@gmail.com") {
        setIsAdmin(true);
        // Do NOT disable sandbox mode here automatically! Let the dev keep their local edits so they can sync/publish them.
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [isFirebaseActive]);

  // Load Portfolio Data (Firestore vs LocalStorage Fallback)
  useEffect(() => {
    setIsLoading(true);
    setLoadedKeys({});

    if (isFirebaseActive && db && !isSandboxMode) {
      console.log("PortfolioContext: Loading from Firestore...");
      
      // Load general profile
      const unsubProfile = onSnapshot(doc(db, "profiles", "main"), (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        } else {
          // Initialize in DB if missing
          setDoc(doc(db, "profiles", "main"), initialProfile).catch(err => {
            console.warn("Unable to write initial profile to firestore", err);
          });
        }
        markLoaded("profile");
      }, (error) => {
        markLoaded("profile");
        handleFirestoreError(error, OperationType.GET, "profiles/main");
      });

      // Load Cover Letter
      const unsubLetter = onSnapshot(doc(db, "cover_letter", "main"), (docSnap) => {
        if (docSnap.exists()) {
          setCoverLetter(docSnap.data() as CoverLetter);
        } else {
          setDoc(doc(db, "cover_letter", "main"), initialCoverLetter).catch(err => {
            console.warn("Unable to write initial cover letter to firestore", err);
          });
        }
        markLoaded("coverLetter");
      }, (error) => {
        markLoaded("coverLetter");
        handleFirestoreError(error, OperationType.GET, "cover_letter/main");
      });

      // Load Thesis
      const unsubThesis = onSnapshot(doc(db, "thesis", "main"), (docSnap) => {
        if (docSnap.exists()) {
          setThesis(docSnap.data() as Thesis);
        } else {
          setDoc(doc(db, "thesis", "main"), initialThesis).catch(err => {
            console.warn("Unable to write initial thesis to firestore", err);
          });
        }
        markLoaded("thesis");
      }, (error) => {
        markLoaded("thesis");
        handleFirestoreError(error, OperationType.GET, "thesis/main");
      });

      // Experiences sub-query
      const expQuery = query(collection(db, "experiences"), orderBy("order", "asc"));
      const unsubExp = onSnapshot(expQuery, (querySnap) => {
        const list: Experience[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Experience);
        });
        if (list.length > 0) {
          setExperiences(list);
        } else if (experiences.length === initialExperiences.length) {
          // Initialize DB with initial list
          initialExperiences.forEach(item => {
            setDoc(doc(db, "experiences", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("experiences");
      }, (error) => {
        markLoaded("experiences");
        handleFirestoreError(error, OperationType.GET, "experiences");
      });

      // Education query
      const eduQuery = query(collection(db, "education"), orderBy("order", "asc"));
      const unsubEdu = onSnapshot(eduQuery, (querySnap) => {
        const list: Education[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Education);
        });
        if (list.length > 0) {
          setEducation(list);
        } else if (education.length === initialEducation.length) {
          initialEducation.forEach(item => {
            setDoc(doc(db, "education", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("education");
      }, (error) => {
        markLoaded("education");
        handleFirestoreError(error, OperationType.GET, "education");
      });

      // Skills query
      const skillsQuery = query(collection(db, "skills"), orderBy("order", "asc"));
      const unsubSkills = onSnapshot(skillsQuery, (querySnap) => {
        const list: SkillCategory[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as SkillCategory);
        });
        if (list.length > 0) {
          setSkills(list);
        } else if (skills.length === initialSkills.length) {
          initialSkills.forEach(item => {
            setDoc(doc(db, "skills", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("skills");
      }, (error) => {
        markLoaded("skills");
        handleFirestoreError(error, OperationType.GET, "skills");
      });

      // Certifications query
      const certsQuery = query(collection(db, "certifications"), orderBy("order", "asc"));
      const unsubCerts = onSnapshot(certsQuery, (querySnap) => {
        const list: Certification[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Certification);
        });
        if (list.length > 0) {
          setCertifications(list);
        } else if (certifications.length === initialCertifications.length) {
          initialCertifications.forEach(item => {
            setDoc(doc(db, "certifications", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("certifications");
      }, (error) => {
        markLoaded("certifications");
        handleFirestoreError(error, OperationType.GET, "certifications");
      });

      // Documents query
      const docsQuery = query(collection(db, "documents"), orderBy("uploadedAt", "desc"));
      const unsubDocs = onSnapshot(docsQuery, (querySnap) => {
        const list: DocumentAttachment[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as DocumentAttachment);
        });
        if (list.length > 0) {
          setDocuments(list);
        } else if (documents.length === initialDocuments.length) {
          initialDocuments.forEach(item => {
            setDoc(doc(db, "documents", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("documents");
      }, (error) => {
        markLoaded("documents");
        handleFirestoreError(error, OperationType.GET, "documents");
      });

      // Projects query
      const projectsQuery = query(collection(db, "projects"), orderBy("order", "asc"));
      const unsubProj = onSnapshot(projectsQuery, (querySnap) => {
        const list: Project[] = [];
        querySnap.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Project);
        });
        if (list.length > 0) {
          setProjects(list);
        } else if (projects.length === initialProjects.length) {
          initialProjects.forEach(item => {
            setDoc(doc(db, "projects", item.id), item).catch(e => console.warn(e));
          });
        }
        markLoaded("projects");
      }, (error) => {
        markLoaded("projects");
        handleFirestoreError(error, OperationType.GET, "projects");
      });

      return () => {
        unsubProfile();
        unsubLetter();
        unsubThesis();
        unsubExp();
        unsubEdu();
        unsubSkills();
        unsubCerts();
        unsubDocs();
        unsubProj();
      };
    } else {
      // Local Storage Fallback
      console.log("PortfolioContext: Loading from LocalStorage...");
      const localProfile = localStorage.getItem("asharma_profile");
      const localExperiences = localStorage.getItem("asharma_experiences");
      const localEducation = localStorage.getItem("asharma_education");
      const localSkills = localStorage.getItem("asharma_skills");
      const localCertifications = localStorage.getItem("asharma_certifications");
      const localCoverLetter = localStorage.getItem("asharma_cover_letter");
      const localThesis = localStorage.getItem("asharma_thesis");
      const localDocuments = localStorage.getItem("asharma_documents");
      const localProjects = localStorage.getItem("asharma_projects");

      if (localProfile) setProfile(JSON.parse(localProfile));
      if (localExperiences) setExperiences(JSON.parse(localExperiences));
      if (localEducation) setEducation(JSON.parse(localEducation));
      if (localSkills) setSkills(JSON.parse(localSkills));
      if (localCertifications) setCertifications(JSON.parse(localCertifications));
      if (localCoverLetter) setCoverLetter(JSON.parse(localCoverLetter));
      if (localThesis) setThesis(JSON.parse(localThesis));
      if (localDocuments) setDocuments(JSON.parse(localDocuments));
      if (localProjects) setProjects(JSON.parse(localProjects));

      // Mark everything loaded for local fallback
      setIsLoading(false);
    }
  }, [isFirebaseActive, isSandboxMode]);

  // Handle local state saving (only if sandbox mode or firebase not configured)
  const saveLocalState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const shouldWriteFirestore = () => {
    return !!(isFirebaseActive && db && (
      (user && user.email === "asharma9albs@gmail.com") ||
      (!isSandboxMode && isAdmin)
    ));
  };

  const syncSandboxToFirestore = async () => {
    if (isFirebaseActive && db && (isSandboxMode || user?.email === "asharma9albs@gmail.com")) {
      try {
        console.log("Publishing local sandbox edits directly to cloud...");
        
        const safeDeleteDoc = async (docRef: any) => {
          try {
            await setDoc(docRef, { passcode: "Pika0portfolio" }, { merge: true });
            await deleteDoc(docRef);
          } catch (err) {
            console.warn("safeDeleteDoc warning (attempting direct delete):", err);
            await deleteDoc(docRef);
          }
        };

        await setDoc(doc(db, "profiles", "main"), { ...profileRef.current, passcode: "Pika0portfolio" }, { merge: true });
        await setDoc(doc(db, "cover_letter", "main"), { ...coverLetterRef.current, passcode: "Pika0portfolio" }, { merge: true });
        await setDoc(doc(db, "thesis", "main"), { ...thesisRef.current, passcode: "Pika0portfolio" }, { merge: true });
        
        // 1. Experiences
        const remoteExps = await getDocs(collection(db, "experiences"));
        const localExpIds = new Set(experiencesRef.current.map(e => e.id));
        for (const docSnap of remoteExps.docs) {
          if (!localExpIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "experiences", docSnap.id));
          }
        }
        for (const exp of experiencesRef.current) {
          await setDoc(doc(db, "experiences", exp.id), { ...exp, passcode: "Pika0portfolio" });
        }

        // 2. Education
        const remoteEdu = await getDocs(collection(db, "education"));
        const localEduIds = new Set(educationRef.current.map(e => e.id));
        for (const docSnap of remoteEdu.docs) {
          if (!localEduIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "education", docSnap.id));
          }
        }
        for (const edu of educationRef.current) {
          await setDoc(doc(db, "education", edu.id), { ...edu, passcode: "Pika0portfolio" });
        }

        // 3. Skills
        const remoteSkills = await getDocs(collection(db, "skills"));
        const localSkillIds = new Set(skillsRef.current.map(s => s.id));
        for (const docSnap of remoteSkills.docs) {
          if (!localSkillIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "skills", docSnap.id));
          }
        }
        for (const sk of skillsRef.current) {
          await setDoc(doc(db, "skills", sk.id), { ...sk, passcode: "Pika0portfolio" });
        }

        // 4. Certifications
        const remoteCerts = await getDocs(collection(db, "certifications"));
        const localCertIds = new Set(certificationsRef.current.map(c => c.id));
        for (const docSnap of remoteCerts.docs) {
          if (!localCertIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "certifications", docSnap.id));
          }
        }
        for (const cert of certificationsRef.current) {
          await setDoc(doc(db, "certifications", cert.id), { ...cert, passcode: "Pika0portfolio" });
        }

        // 5. Documents
        const remoteDocs = await getDocs(collection(db, "documents"));
        const localDocIds = new Set(documentsRef.current.map(d => d.id));
        for (const docSnap of remoteDocs.docs) {
          if (!localDocIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "documents", docSnap.id));
          }
        }
        for (const docObj of documentsRef.current) {
          await setDoc(doc(db, "documents", docObj.id), { ...docObj, passcode: "Pika0portfolio" });
        }

        // 6. Projects
        const remoteProjs = await getDocs(collection(db, "projects"));
        const localProjIds = new Set(projectsRef.current.map(p => p.id));
        for (const docSnap of remoteProjs.docs) {
          if (!localProjIds.has(docSnap.id)) {
            await safeDeleteDoc(doc(db, "projects", docSnap.id));
          }
        }
        for (const proj of projectsRef.current) {
          await setDoc(doc(db, "projects", proj.id), { ...proj, passcode: "Pika0portfolio" });
        }

        console.log("Success: local sandbox published to Cloud Firestore via passcode.");
        return true;
      } catch (err) {
        console.error("Failed to sync sandbox to database:", err);
        return false;
      }
    }
    return false;
  };

  const toggleSandboxMode = async (active: boolean) => {
    // If turning off sandbox mode
    if (!active && isSandboxMode) {
      if (isFirebaseActive && db && user?.email === "asharma9albs@gmail.com") {
        console.log("Auto-publishing sandbox edits to Firestore on exit...");
        await syncSandboxToFirestore();
      } else {
        // Not authenticated as owner. Show an elegant browser prompt to guide them.
        const proceed = window.confirm(
          "⚠️ UNSAVED CHANGES WARNING\n\n" +
          "Exiting 'Interactive Admin Editor' mode without publishing will revert your view back to the live Cloud database, which will hide your local edits.\n\n" +
          "To save your edits permanently to your live portfolio so everyone can see them:\n" +
          "1. Click 'Cancel'\n" +
          "2. Click 'Save to Cloud' in the navigation bar to login and publish.\n\n" +
          "Do you still want to exit and revert?"
        );
        if (!proceed) return;
      }
    }
    
    setIsSandboxMode(active);
    setIsAdmin(active || (user?.email === "asharma9albs@gmail.com"));
  };

  const triggerGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const triggerLogout = async () => {
    try {
      await logout();
      setIsAdmin(false);
      setIsSandboxMode(false);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // --- MUTATION METHODS ---

   const updateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveLocalState("asharma_profile", updated);

      if (shouldWriteFirestore()) {
        setDoc(doc(db, "profiles", "main"), updated, { merge: true }).catch((error) => {
          handleFirestoreError(error, OperationType.WRITE, "profiles/main");
        });
      }
      return updated;
    });
  };

  const updateCoverLetter = async (updates: Partial<CoverLetter>) => {
    setCoverLetter((prev) => {
      const updated = { ...prev, ...updates };
      saveLocalState("asharma_cover_letter", updated);

      if (shouldWriteFirestore()) {
        setDoc(doc(db, "cover_letter", "main"), updated, { merge: true }).catch((error) => {
          handleFirestoreError(error, OperationType.WRITE, "cover_letter/main");
        });
      }
      return updated;
    });
  };

  const updateThesis = async (updates: Partial<Thesis>) => {
    setThesis((prev) => {
      const updated = { ...prev, ...updates };
      saveLocalState("asharma_thesis", updated);

      if (shouldWriteFirestore()) {
        setDoc(doc(db, "thesis", "main"), updated, { merge: true }).catch((error) => {
          handleFirestoreError(error, OperationType.WRITE, "thesis/main");
        });
      }
      return updated;
    });
  };

  const saveExperience = async (exp: Experience) => {
    let list = [...experiences];
    const index = list.findIndex(item => item.id === exp.id);
    
    if (index >= 0) {
      list[index] = exp;
    } else {
      list.push(exp);
    }
    list.sort((a, b) => a.order - b.order);
    setExperiences(list);
    saveLocalState("asharma_experiences", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "experiences", exp.id), exp);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `experiences/${exp.id}`);
      }
    }
  };

  const deleteExperience = async (id: string) => {
    const filtered = experiences.filter(item => item.id !== id);
    setExperiences(filtered);
    saveLocalState("asharma_experiences", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "experiences", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `experiences/${id}`);
      }
    }
  };

  const saveEducation = async (edu: Education) => {
    let list = [...education];
    const index = list.findIndex(item => item.id === edu.id);

    if (index >= 0) {
      list[index] = edu;
    } else {
      list.push(edu);
    }
    list.sort((a, b) => a.order - b.order);
    setEducation(list);
    saveLocalState("asharma_education", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "education", edu.id), edu);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `education/${edu.id}`);
      }
    }
  };

  const deleteEducation = async (id: string) => {
    const filtered = education.filter(item => item.id !== id);
    setEducation(filtered);
    saveLocalState("asharma_education", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "education", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `education/${id}`);
      }
    }
  };

  const saveSkillCategory = async (skill: SkillCategory) => {
    let list = [...skills];
    const index = list.findIndex(item => item.id === skill.id);

    if (index >= 0) {
      list[index] = skill;
    } else {
      list.push(skill);
    }
    list.sort((a, b) => a.order - b.order);
    setSkills(list);
    saveLocalState("asharma_skills", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "skills", skill.id), skill);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `skills/${skill.id}`);
      }
    }
  };

  const deleteSkillCategory = async (id: string) => {
    const filtered = skills.filter(item => item.id !== id);
    setSkills(filtered);
    saveLocalState("asharma_skills", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "skills", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
      }
    }
  };

  const saveCertification = async (cert: Certification) => {
    let list = [...certifications];
    const index = list.findIndex(item => item.id === cert.id);

    if (index >= 0) {
      list[index] = cert;
    } else {
      list.push(cert);
    }
    list.sort((a, b) => a.order - b.order);
    setCertifications(list);
    saveLocalState("asharma_certifications", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "certifications", cert.id), cert);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `certifications/${cert.id}`);
      }
    }
  };

  const deleteCertification = async (id: string) => {
    const filtered = certifications.filter(item => item.id !== id);
    setCertifications(filtered);
    saveLocalState("asharma_certifications", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "certifications", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `certifications/${id}`);
      }
    }
  };

  const saveDocument = async (docObj: DocumentAttachment) => {
    let list = [...documents];
    const index = list.findIndex(item => item.id === docObj.id);

    if (index >= 0) {
      list[index] = docObj;
    } else {
      list.push(docObj);
    }
    setDocuments(list);
    saveLocalState("asharma_documents", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "documents", docObj.id), docObj);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `documents/${docObj.id}`);
      }
    }
  };

  const deleteDocument = async (id: string) => {
    const filtered = documents.filter(item => item.id !== id);
    setDocuments(filtered);
    saveLocalState("asharma_documents", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "documents", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
      }
    }
  };

  const saveProject = async (proj: Project) => {
    let list = [...projects];
    const index = list.findIndex(item => item.id === proj.id);

    if (index >= 0) {
      list[index] = proj;
    } else {
      list.push(proj);
    }
    list.sort((a, b) => a.order - b.order);
    setProjects(list);
    saveLocalState("asharma_projects", list);

    if (shouldWriteFirestore()) {
      try {
        await setDoc(doc(db, "projects", proj.id), proj);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `projects/${proj.id}`);
      }
    }
  };

  const deleteProject = async (id: string) => {
    const filtered = projects.filter(item => item.id !== id);
    setProjects(filtered);
    saveLocalState("asharma_projects", filtered);

    if (shouldWriteFirestore()) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
      }
    }
  };

  const resetToDefaults = () => {
    // Confirm override with user before doing this
    setProfile(initialProfile);
    setExperiences(initialExperiences);
    setEducation(initialEducation);
    setSkills(initialSkills);
    setCertifications(initialCertifications);
    setCoverLetter(initialCoverLetter);
    setThesis(initialThesis);
    setDocuments(initialDocuments);
    setProjects(initialProjects);

    if (!isFirebaseActive || isSandboxMode || !isAdmin) {
      localStorage.removeItem("asharma_profile");
      localStorage.removeItem("asharma_experiences");
      localStorage.removeItem("asharma_education");
      localStorage.removeItem("asharma_skills");
      localStorage.removeItem("asharma_certifications");
      localStorage.removeItem("asharma_cover_letter");
      localStorage.removeItem("asharma_thesis");
      localStorage.removeItem("asharma_documents");
      localStorage.removeItem("asharma_projects");
    } else {
      // Admin resets Firestore
      setDoc(doc(db, "profiles", "main"), initialProfile).catch(e => console.error(e));
      setDoc(doc(db, "cover_letter", "main"), initialCoverLetter).catch(e => console.error(e));
      setDoc(doc(db, "thesis", "main"), initialThesis).catch(e => console.error(e));
    }
  };

  return (
    <PortfolioContext.Provider value={{
      profile,
      experiences,
      education,
      skills,
      certifications,
      coverLetter,
      thesis,
      documents,
      projects,
      isLoading,
      user,
      isAdmin,
      isSandboxMode,
      isFirebaseActive,
      toggleSandboxMode,
      triggerGoogleLogin,
      triggerLogout,
      updateProfile,
      updateCoverLetter,
      updateThesis,
      saveExperience,
      deleteExperience,
      saveEducation,
      deleteEducation,
      saveSkillCategory,
      deleteSkillCategory,
      saveCertification,
      deleteCertification,
      saveDocument,
      deleteDocument,
      saveProject,
      deleteProject,
      resetToDefaults,
      syncSandboxToFirestore
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
