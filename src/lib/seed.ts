import mongoose from 'mongoose';
import Category from '../models/Category';
import Topic from '../models/Topic';
import Chart from '../models/Chart';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

const categoriesData = [
  { slug: 'age-group', name: 'By Age Group', description: 'Adoption, preferred tools, frequency, and use cases across Gen Z, Millennials, Gen X, Boomers.', position: 1 },
  { slug: 'country', name: 'By Country', description: 'AI usage across 30+ countries — leading tools, adoption rates, trust levels.', position: 2 },
  { slug: 'industry', name: 'By Industry', description: 'How marketing, software, design, sales, finance, and healthcare professionals use AI.', position: 3 },
  { slug: 'use-case', name: 'By Use Case', description: 'What people use AI for — writing, coding, image generation, research, schoolwork.', position: 4 },
  { slug: 'market-share', name: 'Market Share', description: 'How ChatGPT, Claude, Gemini, and other AI tools compare in adoption and preference.', position: 5 },
  { slug: 'adoption-trends', name: 'Adoption Trends', description: 'How AI usage has changed over time — quarter-by-quarter and year-by-year growth.', position: 6 }
];

const topicsByAgeGroup = [
  {
    slug: 'how-gen-z-uses-ai-in-daily-life',
    title: 'How Gen Z Uses AI in Daily Life',
    description: 'A look at how 18–25 year olds are using generative AI tools — how often, for what, and which tools dominate their daily workflows. Data compiled from public studies by Pew Research, Gallup, Statista, and other independent sources.',
    methodologyNote: 'This topic compiles survey data from Pew Research Center, Gallup, and Statista. Studies were conducted in late 2025 and early 2026 with representative US demographics.',
    metaTitle: 'How Gen Z Uses AI in Daily Life | AI Behavior Index',
    metaDescription: 'Aggregated survey data on how 18-25 year olds use AI daily, weekly, and for which tasks.',
    status: 'published',
    dataPointsCount: 8,
    sourceCount: 3,
    publishedAt: new Date('2026-03-15T00:00:00Z'),
    lastRefreshedAt: new Date('2026-06-01T00:00:00Z')
  },
  {
    slug: 'gen-z-and-schoolwork-the-quiet-ai-revolution',
    title: 'Gen Z and Schoolwork: The Quiet AI Revolution',
    description: '67% of Gen Z students report using AI for schoolwork — and a third use it daily for assignments. We unpack what\'s driving the shift, how teachers are responding, and what comes next.',
    methodologyNote: 'Common Sense Media survey data from late 2025.',
    status: 'published',
    dataPointsCount: 6,
    sourceCount: 4,
    publishedAt: new Date('2026-04-10T00:00:00Z'),
    lastRefreshedAt: new Date('2026-06-01T00:00:00Z')
  },
  {
    slug: 'gen-zs-trust-in-ai-generated-information',
    title: 'Gen Z\'s Trust in AI-Generated Information',
    description: 'How younger users evaluate AI responses, fact-check claims, and balance convenience against accuracy.',
    methodologyNote: 'Pew Research Center study from 2026.',
    status: 'published',
    dataPointsCount: 5,
    sourceCount: 2,
    publishedAt: new Date('2026-04-20T00:00:00Z')
  },
  {
    slug: 'millennials-at-work-with-ai',
    title: 'Millennials at Work with AI',
    description: 'Just over half of Millennial knowledge workers use AI weekly for writing, research, and meeting prep.',
    status: 'published',
    dataPointsCount: 7,
    sourceCount: 3,
    publishedAt: new Date('2026-03-20T00:00:00Z')
  },
  {
    slug: 'millennial-parents-using-ai-with-their-kids',
    title: 'Millennial Parents Using AI with Their Kids',
    description: 'How Millennial parents introduce AI tools to children — for homework help, creative play, and learning.',
    status: 'published',
    dataPointsCount: 4,
    sourceCount: 2,
    publishedAt: new Date('2026-05-01T00:00:00Z')
  },
  {
    slug: 'gen-x-and-the-ai-learning-curve',
    title: 'Gen X and the AI Learning Curve',
    description: '29% of Gen X uses AI monthly. We map their adoption journey, common entry points, and friction points.',
    status: 'published',
    dataPointsCount: 5,
    sourceCount: 3,
    publishedAt: new Date('2026-03-10T00:00:00Z')
  },
  {
    slug: 'boomers-and-ai-slow-but-steady-adoption',
    title: 'Boomers and AI: Slow but Steady Adoption',
    description: 'Only 12% of Boomers use AI weekly — but among those who do, retention is higher than any other cohort.',
    status: 'published',
    dataPointsCount: 5,
    sourceCount: 2,
    publishedAt: new Date('2026-02-15T00:00:00Z')
  },
  {
    slug: 'boomer-trust-in-ai-healthcare-advice',
    title: 'Boomer Trust in AI Healthcare Advice',
    description: 'Older adults are more cautious about AI medical information — but adoption is rising in specific use cases.',
    status: 'published',
    dataPointsCount: 4,
    sourceCount: 2,
    publishedAt: new Date('2026-05-15T00:00:00Z')
  },
  {
    slug: 'teen-ai-use-13-17-year-olds',
    title: 'Teen AI Use: 13-17 Year Olds',
    description: 'How teenagers use AI for school, social, and creative purposes — and what parents typically don\'t know.',
    status: 'published',
    dataPointsCount: 6,
    sourceCount: 3,
    publishedAt: new Date('2026-05-20T00:00:00Z')
  },
  {
    slug: 'college-students-and-ai-study-tools',
    title: 'College Students and AI Study Tools',
    description: 'Adoption rates of ChatGPT, Claude, and study-specific AI across U.S. and global college campuses.',
    status: 'published',
    dataPointsCount: 7,
    sourceCount: 4,
    publishedAt: new Date('2026-04-05T00:00:00Z')
  },
  {
    slug: 'young-professionals-22-30-ai-habits',
    title: 'Young Professionals (22-30) AI Habits',
    description: 'How early-career knowledge workers use AI to compete, learn faster, and offload routine tasks.',
    status: 'published',
    dataPointsCount: 6,
    sourceCount: 3,
    publishedAt: new Date('2026-04-18T00:00:00Z')
  },
  {
    slug: 'middle-manager-ai-adoption-35-45',
    title: 'Middle Manager AI Adoption (35-45)',
    description: 'A cohort with the highest stakes in AI productivity gains — and the most varied actual use patterns.',
    status: 'published',
    dataPointsCount: 5,
    sourceCount: 3,
    publishedAt: new Date('2026-05-25T00:00:00Z')
  }
];

const chartsForGenZDailyLife = [
  {
    chartId: 'how-gen-z-uses-ai-in-daily-life-c0',
    position: 0,
    title: 'Hero stat: 73% Gen Z weekly AI use',
    chartType: 'hero_stat',
    data: {
      type: 'hero_stat',
      value: '73%',
      label: 'of Gen Z (18-25) use AI tools weekly',
      trend: { direction: 'up', amount: '+32pp since 2022' }
    },
    sourceLine: 'Source: Pew Research Center (2026); Gallup (2025); compiled by OneChat AI',
    status: 'active',
    sources: [
      { position: 1, sourceName: 'Pew Research Center', publication: 'Generational AI Adoption Study', publicationDate: new Date('2026-02-01') },
      { position: 2, sourceName: 'Gallup', publication: 'AI and the Future of Work', publicationDate: new Date('2025-10-15') }
    ]
  },
  {
    chartId: 'how-gen-z-uses-ai-in-daily-life-c1',
    position: 1,
    title: 'Weekly AI tool usage by generation',
    chartType: 'vbar',
    data: {
      type: 'vbar',
      xLabel: 'Generation',
      yLabel: '% using AI weekly',
      yFormat: 'percentage',
      data: [
        { label: 'Gen Z (18–25)', value: 73, color: '#088DFF' },
        { label: 'Millennials (26–41)', value: 64, color: '#0468BD' },
        { label: 'Gen X (42–57)', value: 38, color: '#A8A8B0' },
        { label: 'Boomers (58+)', value: 19, color: '#A8A8B0' }
      ]
    },
    sourceLine: 'Source: Pew Research Center (2026); compiled by OneChat AI',
    status: 'active',
    sources: [
      { position: 1, sourceName: 'Pew Research Center', publication: 'Generational AI Adoption Study', publicationDate: new Date('2026-02-01') }
    ]
  },
  {
    chartId: 'how-gen-z-uses-ai-in-daily-life-c2',
    position: 2,
    title: 'Gen Z weekly AI usage growth, 2022–2026',
    chartType: 'line',
    data: {
      type: 'line',
      xLabel: 'Year',
      yLabel: '% adults using AI weekly',
      yFormat: 'percentage',
      series: [
        {
          name: 'Gen Z (18–25)',
          color: '#088DFF',
          data: [
            { x: '2022', y: 41 },
            { x: '2023', y: 58 },
            { x: '2024', y: 67 },
            { x: '2025', y: 73 },
            { x: '2026', y: 78 }
          ]
        },
        {
          name: 'Boomers (58+)',
          color: '#E5483F',
          data: [
            { x: '2022', y: 4 },
            { x: '2023', y: 9 },
            { x: '2024', y: 14 },
            { x: '2025', y: 19 },
            { x: '2026', y: 24 }
          ]
        }
      ]
    },
    sourceLine: 'Source: Pew Research Center, Stanford AI Index (2026)',
    status: 'active',
    sources: [
      { position: 1, sourceName: 'Pew Research Center', publication: 'Longitudinal AI Study', publicationDate: new Date('2026-02-01') },
      { position: 2, sourceName: 'Stanford HAI', publication: 'Stanford Artificial Intelligence Index', publicationDate: new Date('2026-04-12') }
    ]
  },
  {
    chartId: 'how-gen-z-uses-ai-in-daily-life-c3',
    position: 3,
    title: 'Top AI tools used by Gen Z',
    chartType: 'donut',
    data: {
      type: 'donut',
      yLabel: 'Percentage',
      yFormat: 'percentage',
      data: [
        { label: 'ChatGPT', value: 58, color: '#088DFF' },
        { label: 'Gemini', value: 18, color: '#E5483F' },
        { label: 'Claude', value: 9, color: '#F39323' },
        { label: 'Copilot', value: 8, color: '#0468BD' },
        { label: 'Other', value: 7, color: '#A8A8B0' }
      ]
    },
    sourceLine: 'Source: Morning Consult (2026)',
    status: 'active',
    sources: [
      { position: 1, sourceName: 'Morning Consult', publication: 'AI Brand Preference Survey', publicationDate: new Date('2026-01-20') }
    ]
  },
  {
    chartId: 'how-gen-z-uses-ai-in-daily-life-c4',
    position: 4,
    title: 'Top AI use cases among Gen Z',
    chartType: 'hbar',
    data: {
      type: 'hbar',
      xLabel: '% of Gen Z AI users',
      yLabel: 'Use Case',
      yFormat: 'percentage',
      data: [
        { label: 'Writing & editing', value: 68, color: '#088DFF' },
        { label: 'Search & research', value: 61, color: '#088DFF' },
        { label: 'Coding & technical', value: 42, color: '#088DFF' },
        { label: 'Brainstorming', value: 39, color: '#088DFF' },
        { label: 'Creative work', value: 31, color: '#088DFF' }
      ]
    },
    sourceLine: 'Source: Pew Research Center (2026)',
    status: 'active',
    sources: [
      { position: 1, sourceName: 'Pew Research Center', publication: 'AI Use Cases Survey', publicationDate: new Date('2026-02-01') }
    ]
  }
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);

  console.log('Clearing existing collections (Category, Topic, Chart)...');
  await Category.deleteMany({});
  await Topic.deleteMany({});
  await Chart.deleteMany({});

  console.log('Seeding Categories...');
  const seededCategories = await Category.insertMany(categoriesData);
  console.log(`Successfully seeded ${seededCategories.length} categories.`);

  // Find Category for By Age Group
  const ageGroupCategory = seededCategories.find(c => c.slug === 'age-group');
  if (!ageGroupCategory) {
    throw new Error('Age Group category not found after insert.');
  }

  console.log('Seeding Topics for By Age Group...');
  const topicsDataWithCat = topicsByAgeGroup.map(topic => ({
    ...topic,
    categoryId: ageGroupCategory._id
  }));
  const seededTopics = await Topic.insertMany(topicsDataWithCat);
  console.log(`Successfully seeded ${seededTopics.length} topics.`);

  // Find the topic "how-gen-z-uses-ai-in-daily-life"
  const genZTopic = seededTopics.find(t => t.slug === 'how-gen-z-uses-ai-in-daily-life');
  if (!genZTopic) {
    throw new Error('Gen Z Topic not found after insert.');
  }

  console.log('Seeding Charts for Gen Z daily life...');
  const chartsDataWithTopic = chartsForGenZDailyLife.map(chart => ({
    ...chart,
    topicId: genZTopic._id
  }));
  const seededCharts = await Chart.insertMany(chartsDataWithTopic);
  console.log(`Successfully seeded ${seededCharts.length} charts.`);

  // Update topicCount for all Categories
  for (const cat of seededCategories) {
    const count = await Topic.countDocuments({ categoryId: cat._id });
    await Category.updateOne({ _id: cat._id }, { $set: { topicCount: count } });
  }
  console.log('Updated topicCount denormalized values for Categories.');

  console.log('Database seeding finished successfully!');
}

seed()
  .then(() => {
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    mongoose.disconnect();
    process.exit(1);
  });
