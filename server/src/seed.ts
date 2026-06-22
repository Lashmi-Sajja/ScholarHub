import 'dotenv/config'
import mongoose from 'mongoose'
import Opportunity from './models/Opportunity'

const opportunities = [
  { title: 'Google Solution Challenge', type: 'hackathon' as const, description: 'Build a solution that contributes to solving one or more of the UNs 17 Sustainable Development Goals.', url: 'https://developers.google.com/community/gdsc-solution-challenge', deadline: new Date('2026-06-30') },
  { title: 'MLH Summer Fellowship', type: 'internship' as const, description: 'A 12-week remote program where you build real-world projects and contribute to open source.', url: 'https://fellowship.mlh.io', deadline: new Date('2026-07-15') },
  { title: 'Knight-Hennessy Scholars', type: 'scholarship' as const, description: 'Full funding for graduate study at Stanford University, with leadership development.', url: 'https://knighthennessy.stanford.edu', deadline: new Date('2026-10-01') },
  { title: 'ACM ICPC World Finals', type: 'competition' as const, description: 'The premier global collegiate programming competition.', url: 'https://icpc.global', deadline: new Date('2026-08-01') },
  { title: 'NASA Space Apps Challenge', type: 'hackathon' as const, description: 'A 48-hour global hackathon using NASA data to solve real-world problems.', url: 'https://www.spaceappschallenge.org', deadline: new Date('2026-10-01') },
  { title: 'Microsoft Internship Program', type: 'internship' as const, description: 'Paid internships across engineering, design, and research roles.', url: 'https://careers.microsoft.com', deadline: new Date('2026-09-01') },
  { title: 'Rhodes Scholarship', type: 'scholarship' as const, description: 'Full funding for postgraduate study at the University of Oxford.', url: 'https://www.rhodeshouse.ox.ac.uk', deadline: new Date('2026-10-15') },
  { title: 'Google Code Jam', type: 'competition' as const, description: 'One of the largest coding competitions in the world.', url: 'https://codingcompetitions.withgoogle.com/codejam', deadline: new Date('2026-05-01') },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!)
  await Opportunity.deleteMany({})
  await Opportunity.insertMany(opportunities)
  console.log(`Seeded ${opportunities.length} opportunities`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
