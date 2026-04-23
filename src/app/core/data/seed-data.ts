import { Board } from '../models/board.models';

export const SEED_DATA: Board[] = [
  {
    id: 'board-platform-launch',
    name: 'Platform Launch',
    columns: [
      {
        id: 'col-todo',
        name: 'Todo',
        color: '#49C4E5',
        tasks: [
          {
            id: 'task-1',
            title: 'Build UI for onboarding flow',
            description: '',
            status: 'Todo',
            subtasks: [
              { id: 'sub-1a', title: 'Sign up page', isCompleted: false },
              { id: 'sub-1b', title: 'Sign in page', isCompleted: false },
              { id: 'sub-1c', title: 'Welcome page', isCompleted: false },
            ],
          },
          {
            id: 'task-2',
            title: 'Build UI for search',
            description: '',
            status: 'Todo',
            subtasks: [
              { id: 'sub-2a', title: 'Search page', isCompleted: false },
            ],
          },
          {
            id: 'task-3',
            title: 'Build settings UI',
            description: '',
            status: 'Todo',
            subtasks: [
              { id: 'sub-3a', title: 'Account page', isCompleted: false },
              { id: 'sub-3b', title: 'Billing page', isCompleted: false },
            ],
          },
          {
            id: 'task-4',
            title: 'QA and test all major user journeys',
            description:
              'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
            status: 'Todo',
            subtasks: [
              {
                id: 'sub-4a',
                title: 'Internal testing',
                isCompleted: false,
              },
              {
                id: 'sub-4b',
                title: 'External testing',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        id: 'col-doing',
        name: 'Doing',
        color: '#8471F2',
        tasks: [
          {
            id: 'task-5',
            title: 'Design settings and search pages',
            description: '',
            status: 'Doing',
            subtasks: [
              { id: 'sub-5a', title: 'Settings - Account page', isCompleted: true },
              { id: 'sub-5b', title: 'Settings - Billing page', isCompleted: false },
              { id: 'sub-5c', title: 'Search page', isCompleted: false },
            ],
          },
          {
            id: 'task-6',
            title: 'Add account management endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              { id: 'sub-6a', title: 'Upgrade plan', isCompleted: true },
              { id: 'sub-6b', title: 'Cancel plan', isCompleted: true },
              { id: 'sub-6c', title: 'Update payment method', isCompleted: false },
            ],
          },
          {
            id: 'task-7',
            title: 'Design onboarding flow',
            description: '',
            status: 'Doing',
            subtasks: [
              { id: 'sub-7a', title: 'Sign up page', isCompleted: true },
              { id: 'sub-7b', title: 'Sign in page', isCompleted: false },
              { id: 'sub-7c', title: 'Welcome page', isCompleted: false },
            ],
          },
          {
            id: 'task-8',
            title: 'Add search enpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              { id: 'sub-8a', title: 'Add search endpoint', isCompleted: true },
              { id: 'sub-8b', title: 'Define search criteria', isCompleted: false },
            ],
          },
          {
            id: 'task-9',
            title: 'Add authentication endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              { id: 'sub-9a', title: 'Define user model', isCompleted: true },
              { id: 'sub-9b', title: 'Add auth endpoints', isCompleted: false },
            ],
          },
          {
            id: 'task-10',
            title:
              'Research pricing points of various competitors and trial different business models',
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            status: 'Doing',
            subtasks: [
              {
                id: 'sub-10a',
                title: 'Research competitor pricing and business models',
                isCompleted: true,
              },
              {
                id: 'sub-10b',
                title: 'Outline a business model that works for our solution',
                isCompleted: true,
              },
              {
                id: 'sub-10c',
                title:
                  'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        id: 'col-done',
        name: 'Done',
        color: '#67E2AE',
        tasks: [
          {
            id: 'task-11',
            title: 'Conduct 5 wireframe tests',
            description: 'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-11a',
                title: 'Complete 5 wireframe prototype tests',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-12',
            title: 'Create wireframe prototype',
            description: 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-12a',
                title: 'Create clickable wireframe prototype in Balsamiq',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-13',
            title: 'Review results of usability tests and iterate',
            description:
              "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
            status: 'Done',
            subtasks: [
              {
                id: 'sub-13a',
                title: 'Meet to review notes from previous tests and plan changes',
                isCompleted: true,
              },
              {
                id: 'sub-13b',
                title: 'Make changes to paper prototypes',
                isCompleted: true,
              },
              {
                id: 'sub-13c',
                title: 'Conduct 5 usability tests',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-14',
            title:
              'Create paper prototypes and conduct 10 usability tests with potential customers',
            description: '',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-14a',
                title: 'Create paper prototypes for version one',
                isCompleted: true,
              },
              {
                id: 'sub-14b',
                title: 'Complete 10 usability tests',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-15',
            title: 'Market discovery',
            description:
              'We need to define and refine our core product. Interviews will help us learn common pain points and help us understand the real job the product needs to do.',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-15a',
                title: 'Interview 10 prospective customers',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-16',
            title: 'Competitor analysis',
            description: '',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-16a',
                title: 'Find direct and indirect competitors',
                isCompleted: true,
              },
              {
                id: 'sub-16b',
                title: 'SWOT analysis for each competitor',
                isCompleted: true,
              },
            ],
          },
          {
            id: 'task-17',
            title: 'Research the market',
            description:
              'We need to get a solid understanding of the market to ensure we have up-to-date estimates of market size and demand.',
            status: 'Done',
            subtasks: [
              {
                id: 'sub-17a',
                title: 'Write up research analysis',
                isCompleted: true,
              },
              {
                id: 'sub-17b',
                title: 'Calculate TAM',
                isCompleted: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'board-marketing-plan',
    name: 'Marketing Plan',
    columns: [
      { id: 'col-mp-todo', name: 'Todo', color: '#49C4E5', tasks: [] },
      { id: 'col-mp-doing', name: 'Doing', color: '#8471F2', tasks: [] },
      { id: 'col-mp-done', name: 'Done', color: '#67E2AE', tasks: [] },
    ],
  },
  {
    id: 'board-roadmap',
    name: 'Roadmap',
    columns: [
      { id: 'col-rm-now', name: 'Now', color: '#49C4E5', tasks: [] },
      { id: 'col-rm-next', name: 'Next', color: '#8471F2', tasks: [] },
      { id: 'col-rm-later', name: 'Later', color: '#67E2AE', tasks: [] },
    ],
  },
];
