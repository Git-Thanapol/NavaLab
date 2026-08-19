import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const localized = z.object({ th: z.string(), en: z.string() });
const localizedList = z.object({ th: z.array(z.string()), en: z.array(z.string()) });

const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: localized,
      role: localized,
      photo: image(),
      bioShort: localized,
      bio: localized,
      expertise: localizedList,
      experience: z
        .array(
          z.object({
            role: localized,
            organization: z.string(),
            period: z.string(),
          })
        )
        .default([]),
      education: z.array(
        z.object({
          degree: localized,
          field: localized,
          institution: localized,
          year: z.number().optional(),
        })
      ),
      research: z.object({
        current: z.array(z.object({ title: localized, summary: localized })),
        completed: z.array(
          z.object({ title: localized, summary: localized, year: z.number() })
        ),
      }),
      publications: z.array(
        z.object({
          title: z.string(),
          authors: z.string(),
          venue: z.string(),
          year: z.number(),
          doi: z.string().optional(),
          url: z.string().url().optional(),
        })
      ),
      projects: z.array(reference('projects')).default([]),
      links: z.object({
        email: z.string().email().optional(),
        linkedin: z.string().url().optional(),
        scholar: z.string().url().optional(),
        orcid: z.string().url().optional(),
        researchgate: z.string().url().optional(),
        website: z.string().url().optional(),
      }),
      cv: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: localized,
      summary: localized,
      body: localized.optional(),
      cover: image(),
      status: z.enum(['ongoing', 'completed']),
      year: z.number(),
      members: z.array(reference('members')).default([]),
      featured: z.boolean().default(false),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: localized,
      date: z.coerce.date(),
      cover: image().optional(),
      excerpt: localized,
      body: localized,
      gallery: z
        .array(z.object({ image: image(), caption: localized }))
        .default([]),
    }),
});

const site = defineCollection({
  loader: file('./src/content/site/home.json'),
  schema: z.object({
    heroHeading: localized,
    heroSub: localized,
    visionStatement: localized,
    missionPillars: z.array(z.object({ title: localized, description: localized })).default([]),
    expertiseAreas: z.array(z.object({ title: localized, description: localized })),
    contactEmail: z.string().email(),
    socials: z.object({
      linkedin: z.string().url().optional(),
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
    }),
  }),
});

export const collections = { members, projects, news, site };
