export const sidebarItems = [
  { label: 'Dashboard', href: '#', icon: 'LayoutDashboard', active: true },
  { label: 'Devices', href: '#devices', icon: 'Cpu' },
  { label: 'Automations', href: '#automations', icon: 'Zap' },
  { label: 'Events', href: '#history', icon: 'CalendarClock' },
  { label: 'Reminders', href: '#reminders', icon: 'Bell' },
  { label: 'Analytics', href: '#analytics', icon: 'BarChart2' },
  { label: 'Settings', href: '#settings', icon: 'Settings' },
];

export const statusCards: { label: string; value: string; hint: string; tone: 'teal' | 'slate' | 'amber' }[] = [
  { label: 'Home state', value: 'Away', hint: 'Detected 2 min ago', tone: 'teal' },
  { label: 'Reminders ready', value: '4', hint: 'Keys, wallet, stove, lights', tone: 'slate' },
  { label: 'Device health', value: '7 / 8', hint: '1 simulator offline', tone: 'amber' },
  { label: 'Rules active', value: '5', hint: '2 custom scenes armed', tone: 'slate' },
];

export const reminders = [
  { title: 'Take house keys', detail: 'Front-door beacon has no key tag nearby.', priority: 'High' },
  { title: 'Turn off kitchen lights', detail: 'Kitchen circuit still draws power after leave event.', priority: 'Medium' },
  { title: 'Check gas stove', detail: 'Stove safety sensor is in standby but not confirmed off.', priority: 'High' },
  { title: 'Carry student ID', detail: 'Weekday reminder for campus days.', priority: 'Low' },
];

export const devices = [
  { name: 'Entry motion sensor', state: 'Online', meta: 'Last ping 12s ago' },
  { name: 'Door lock relay', state: 'Locked', meta: 'Synced with Node-RED flow' },
  { name: 'Kitchen light switch', state: 'On', meta: '3.1W standby draw' },
  { name: 'Gas safety sensor', state: 'Safe', meta: 'No leak detected' },
];

export const history = [
  { time: '07:42', event: 'Leave event detected', description: 'Phone disconnected from home Wi\u2011Fi and door sensor closed.' },
  { time: '07:43', event: 'Reminder sent', description: 'Keys missing, kitchen light still on.' },
  { time: '07:44', event: 'Light turned off', description: 'Automation acknowledged through dashboard.' },
  { time: '07:48', event: 'All safe', description: 'No outstanding reminders.' },
];

export const automationRules = [
  { name: 'Leave confidence', description: 'Trigger when Wi\u2011Fi disconnects + door closes within 90 seconds.', enabled: true },
  { name: 'Night stove check', description: 'Escalate reminder after 10:00 PM if stove sensor is unresolved.', enabled: true },
  { name: 'Campus checklist', description: 'On weekdays, add wallet and student ID to the outgoing checklist.', enabled: false },
];
