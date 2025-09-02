import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createProjectInputSchema, 
  updateProjectInputSchema,
  createSkillInputSchema,
  createContactFormInputSchema,
  updateProfessionalInfoInputSchema
} from './schema';
import { getProjects } from './handlers/get_projects';
import { createProject } from './handlers/create_project';
import { updateProject } from './handlers/update_project';
import { getSkills } from './handlers/get_skills';
import { createSkill } from './handlers/create_skill';
import { submitContactForm } from './handlers/submit_contact_form';
import { getContactForms } from './handlers/get_contact_forms';
import { getProfessionalInfo } from './handlers/get_professional_info';
import { updateProfessionalInfo } from './handlers/update_professional_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Project management routes
  getProjects: publicProcedure
    .query(() => getProjects()),

  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),

  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),

  // Skills management routes
  getSkills: publicProcedure
    .query(() => getSkills()),

  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),

  // Contact form routes
  submitContactForm: publicProcedure
    .input(createContactFormInputSchema)
    .mutation(({ input }) => submitContactForm(input)),

  getContactForms: publicProcedure
    .query(() => getContactForms()),

  // Professional info routes
  getProfessionalInfo: publicProcedure
    .query(() => getProfessionalInfo()),

  updateProfessionalInfo: publicProcedure
    .input(updateProfessionalInfoInputSchema)
    .mutation(({ input }) => updateProfessionalInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();