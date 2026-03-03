// constants/api.ts

export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  DASHBOARD: {
    STATS: "/dashboard/stats",
  },

  LEADS: {
    LIST: "/leads",
    SHOW: (id: number) => `/leads/${id}`,
    CREATE: "/leads",
    UPDATE: (id: number) => `/leads/${id}`,
    DELETE: (id: number) => `/leads/${id}`,
  },

  CONTACTS: {
    LIST: "/contacts",
    SHOW: (id: number) => `/contacts/${id}`,
    UPDATE: (id: number) => `/contacts/${id}`,
    DELETE: (id: number) => `/contacts/${id}`,
  },

  PROPERTIES: {
    LIST: "/properties",
    SHOW: (id: number) => `/properties/${id}`,
    UPDATE: (id: number) => `/properties/${id}`,
    DELETE: (id: number) => `/properties/${id}`,
    GROUPS: {
      LIST: "/properties/groups",
      SHOW: (id: number) => `/properties/groups/${id}`,
      DELETE: (id: number) => `/properties/groups/${id}`,
    },
  },

  CALENDAR: {
    PROPERTY: "/calendar/property",
    STAFF: "/calendar/staff",
  },

  OPERATIONS: {
    PROCESSES: {
      LIST: "/operations/processes",
      SHOW: (id: number) => `/operations/processes/${id}`,
      DELETE: (id: number) => `/operations/processes/${id}`,
    },
    PROJECTS: {
      LIST: "/operations/projects",
      SHOW: (id: number) => `/operations/projects/${id}`,
      DELETE: (id: number) => `/operations/projects/${id}`,
    },
    AUTOMATIONS: {
      LIST: "/operations/automations",
      SHOW: (id: number) => `/operations/automations/${id}`,
      DELETE: (id: number) => `/operations/automations/${id}`,
    },
  },

  MESSAGES: {
    LIST: "/messages",
    SHOW: (id: number) => `/messages/${id}`,
    SEND: "/messages/send",
  },

  REPORTS: {
    LIST: "/reports",
    EXPORT: "/reports/export",
  },

  SETTINGS: {
    STAFF: {
      LIST: "/settings/staff",
      SHOW: (id: number) => `/settings/staff/${id}`,
      DELETE: (id: number) => `/settings/staff/${id}`,
    },
    STAGES: {
      LIST: "/settings/stages",
      SHOW: (id: number) => `/settings/stages/${id}`,
      REORDER: "/settings/stages/reorder",
      DELETE: (id: number) => `/settings/stages/${id}`,
    },
    TEMPLATES: {
      LIST: "/settings/templates",
      SHOW: (id: number) => `/settings/templates/${id}`,
      DELETE: (id: number) => `/settings/templates/${id}`,
    },
    PROPERTY_TAGS: {
      LIST: "/settings/property-tags",
      SHOW: (id: number) => `/settings/property-tags/${id}`,
      DELETE: (id: number) => `/settings/property-tags/${id}`,
    },
    CUSTOM_FIELDS: {
      LIST: "/settings/custom-fields",
      SHOW: (id: number) => `/settings/custom-fields/${id}`,
      DELETE: (id: number) => `/settings/custom-fields/${id}`,
    },
  },
};
