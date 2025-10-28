import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"
import { Settings, MessagesSquare, Ticket, Laptop, Smartphone, UserCircle2, AlertTriangle, XCircle, Search, Pin, Play, Loader2, BookOpen, Layers, FileText, CheckCircle2, Circle, Clock3, Mic, BadgeCheck, Bot, Wallet, ClipboardList, Plane, CalendarDays, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"

const AGENT_CLUSTER_KEYWORDS = ['Zoom', 'Outlook', 'VDI', 'Password Reset', 'VPN', 'Teams', 'Hardware', 'Device', 'Endpoint', 'Service Request']

// Mock data with tickets, devices, suggestions, trainings
function useMockData() {
  const tickets = useMemo(() => {
    const clusterData = [
      {
        issueSignature: 'email-profile-sync-failure',
        issueLabel: 'Outlook profiles failing to sync',
        topic: 'Email & Collaboration',
        guidance: {
          type: 'resolution',
          title: 'Restore Outlook profile health',
          steps: [
            'Run the Outlook profile repair workflow or rebuild the OST cache.',
            'Confirm Teams and Exchange add-ins re-register after profile repair.',
            'Escalate to Messaging Tier 2 if sync errors persist past 30 minutes.'
          ]
        },
        tickets: [
          {
            id: 'INC-50123',
            user: 'anuj@org.com',
            title: 'Outlook profile corrupted after laptop reimage',
            service: 'Outlook',
            priority: 'P3',
            vip: false,
            assignedTo: 'DeskSide-DEL',
            openDate: '2025-09-20 10:00',
            expectedCompletion: '2025-09-21 12:00',
            timeline: ['Opened', 'Assigned', 'In Progress'],
            resolutionHints: [
              'Run the repair Outlook workflow to rebuild profile',
              'Purge local OST cache and re-sync mailbox'
            ]
          },
          {
            id: 'INC-50128',
            user: 'madhu@org.com',
            title: 'Teams add-in missing after Outlook profile reset',
            service: 'Teams',
            priority: 'P2',
            vip: false,
            assignedTo: 'Messaging-Tier2',
            openDate: '2025-09-20 06:35',
            expectedCompletion: '2025-09-20 13:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Check Teams meeting add-in status and re-register if disabled',
              'Sync mailbox via Graph API to rebuild calendar entries'
            ]
          },
          {
            id: 'INC-50129',
            user: 'vip.user@org.com',
            title: 'VIP Outlook profile cannot send external mail',
            service: 'Outlook',
            priority: 'P1',
            vip: true,
            assignedTo: 'Messaging-Tier2',
            openDate: '2025-09-20 08:15',
            expectedCompletion: '2025-09-20 09:45',
            timeline: ['Opened', 'Assigned', 'Vendor Engaged'],
            resolutionHints: [
              'Temporarily reroute VIP mailbox through failover transport',
              'Purge pending outbound queue on Exchange connector'
            ]
          },
          {
            id: 'INC-50132',
            user: 'sarah@org.com',
            title: 'Shared mailbox missing folders after profile refresh',
            service: 'Exchange Online',
            priority: 'P3',
            vip: false,
            assignedTo: 'Messaging-Tier2',
            openDate: '2025-09-19 17:40',
            expectedCompletion: '2025-09-21 09:00',
            timeline: ['Opened', 'Assigned', 'Pending Data Restore'],
            resolutionHints: [
              'Validate retention policy and restore via compliance search',
              'Enable single item recovery temporarily to protect restores'
            ]
          }
        ]
      },
      {
        issueSignature: 'outlook-search-index-stall',
        issueLabel: 'Outlook search index stalling',
        topic: 'Email & Collaboration',
        guidance: {
          type: 'resolution',
          title: 'Rebuild Outlook search index health',
          steps: [
            'Trigger a Windows Search index rebuild for the affected profile.',
            'Verify Exchange Online indexing status in service health.',
            'Escalate to Messaging Tier 2 if no improvement within 60 minutes.'
          ],
          notes: 'Monitor Outlook service advisories for indexing backlog alerts.'
        },
        tickets: [
          {
            id: 'INC-50160',
            user: 'ravi@org.com',
            title: 'Outlook search returning no results',
            service: 'Outlook',
            priority: 'P2',
            vip: false,
            assignedTo: 'Messaging-Tier2',
            openDate: '2025-09-20 12:10',
            expectedCompletion: '2025-09-21 10:00',
            timeline: ['Opened', 'Assigned', 'Index Rebuild Running'],
            resolutionHints: [
              'Force rebuild Windows Search index for Outlook profile',
              'Validate mailbox indexing status on Exchange Online'
            ]
          },
          {
            id: 'INC-50161',
            user: 'priya@org.com',
            title: 'Outlook search stuck indexing forever',
            service: 'Outlook',
            priority: 'P3',
            vip: false,
            assignedTo: 'Messaging-Tier2',
            openDate: '2025-09-20 13:05',
            expectedCompletion: '2025-09-21 11:30',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Purge OST and rehydrate mailbox via cached mode',
              'Check service health dashboard for indexing backlog'
            ]
          }
        ]
      },
      {
        issueSignature: 'zoom-audio-dropouts',
        issueLabel: 'Zoom audio dropouts during calls',
        topic: 'Collaboration Tools',
        guidance: {
          type: 'resolution',
          title: 'Stabilize Zoom audio quality',
          steps: [
            'Check live packet loss in Zoom dashboard and reroute user to alternate media region.',
            'Lower audio bitrate or enable optimized audio mode for impacted meetings.',
            'Escalate to Collaboration Tier 2 if dropouts persist after mitigations.'
          ]
        },
        tickets: [
          {
            id: 'INC-60101',
            user: 'dave@org.com',
            title: 'Zoom audio drops every few minutes',
            service: 'Zoom',
            priority: 'P2',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 07:25',
            expectedCompletion: '2025-09-20 15:00',
            timeline: ['Opened', 'Assigned', 'Monitoring'],
            resolutionHints: [
              'Check packet loss on network path',
              'Switch user to optimized Zoom media region'
            ]
          },
          {
            id: 'INC-60102',
            user: 'emma@org.com',
            title: 'Zoom meeting audio crackling for leadership call',
            service: 'Zoom',
            priority: 'P3',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 08:05',
            expectedCompletion: '2025-09-20 16:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Collect Zoom audio diagnostic logs',
              'Lower audio bitrate to stabilize stream'
            ]
          }
        ]
      },
      {
        issueSignature: 'zoom-login-failures',
        issueLabel: 'Zoom login failures for traders',
        topic: 'Collaboration Tools',
        guidance: {
          type: 'resolution',
          title: 'Restore Zoom SSO authentication',
          steps: [
            'Validate Okta SAML integration status and recent changes.',
            'Purge cached Zoom credentials and force token refresh for the user.',
            'Engage vendor support if SSO errors continue after token reset.'
          ],
          notes: 'Communicate workaround dial-in options for trading desks if SSO remains unstable.'
        },
        tickets: [
          {
            id: 'INC-60103',
            user: 'jason@org.com',
            title: 'Zoom SSO login failing for traders',
            service: 'Zoom',
            priority: 'P1',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 05:40',
            expectedCompletion: '2025-09-20 09:00',
            timeline: ['Opened', 'Assigned', 'Escalated to Vendor'],
            resolutionHints: [
              'Validate Okta SAML integration status',
              'Purge cached Zoom credentials and retry SSO'
            ]
          },
          {
            id: 'INC-60104',
            user: 'linda@org.com',
            title: 'Zoom client stuck at verifying account',
            service: 'Zoom',
            priority: 'P2',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 06:20',
            expectedCompletion: '2025-09-20 12:30',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Reset Zoom token via admin console',
              'Re-register workstation in zero trust policy'
            ]
          }
        ]
      },
      {
        issueSignature: 'teams-call-quality-drop',
        issueLabel: 'Teams call quality degradation',
        topic: 'Collaboration Tools',
        guidance: {
          type: 'resolution',
          title: 'Improve Teams real-time media performance',
          steps: [
            'Review ExpressRoute and SBC utilization for the impacted region.',
            'Shift affected callers to backup SBC or alternate region if congestion persists.',
            'Capture call analytics and escalate to Collaboration Tier 2 when QoS tuning fails.'
          ]
        },
        tickets: [
          {
            id: 'INC-60110',
            user: 'mark@org.com',
            title: 'Teams call jitter in APAC site',
            service: 'Teams',
            priority: 'P2',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-19 22:15',
            expectedCompletion: '2025-09-20 11:00',
            timeline: ['Opened', 'Assigned', 'QoS Adjusted'],
            resolutionHints: [
              'Review ExpressRoute utilization',
              'Shift traffic to backup SBC'
            ]
          },
          {
            id: 'INC-60111',
            user: 'nina@org.com',
            title: 'Teams audio delay during townhall',
            service: 'Teams',
            priority: 'P1',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 07:55',
            expectedCompletion: '2025-09-20 10:30',
            timeline: ['Opened', 'Assigned', 'Monitoring'],
            resolutionHints: [
              'Enable dynamic jitter buffer for impacted users',
              'Lower live event bitrate in tenant settings'
            ]
          }
        ]
      },
      {
        issueSignature: 'teams-meeting-join-errors',
        issueLabel: 'Teams meeting join errors',
        topic: 'Collaboration Tools',
        guidance: {
          type: 'resolution',
          title: 'Unblock Teams meeting access',
          steps: [
            'Clear Teams local cache and re-run authentication for the user.',
            'Re-issue meeting invites or provide PSTN fallback if join still fails.',
            'Escalate to Collaboration Tier 2 for persistent tenant-side join faults.'
          ]
        },
        tickets: [
          {
            id: 'INC-60112',
            user: 'oliver@org.com',
            title: 'Teams meeting join fails with error CAA5004',
            service: 'Teams',
            priority: 'P2',
            vip: false,
            assignedTo: 'Collab-Tier2',
            openDate: '2025-09-20 08:45',
            expectedCompletion: '2025-09-20 14:00',
            timeline: ['Opened', 'Assigned', 'Authentication Reset'],
            resolutionHints: [
              'Clear Teams cache and re-run auth flow',
              'Re-issue meeting join link with fallback PSTN'
            ]
          },
          {
            id: 'INC-60113',
            user: 'peter@org.com',
            title: 'Teams meeting join button not responsive',
            service: 'Teams',
            priority: 'P3',
            vip: false,
            assignedTo: 'Collab-Tier1',
            openDate: '2025-09-20 09:05',
            expectedCompletion: '2025-09-20 17:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Reinstall Teams WebView components',
              'Validate Teams app permissions in Intune'
            ]
          }
        ]
      },
      {
        issueSignature: 'vdi-session-freeze',
        issueLabel: 'VDI sessions freezing mid-shift',
        topic: 'Virtual Desktop',
        guidance: {
          type: 'resolution',
          title: 'Restore VDI session stability',
          steps: [
            'Capture session recording or performance metrics before reset.',
            'Move trader to a healthy VDI host pool and monitor resource load.',
            'Escalate to VDI engineering if freezes recur on alternate hosts.'
          ]
        },
        tickets: [
          {
            id: 'INC-60201',
            user: 'quinn@org.com',
            title: 'VDI session frozen during order entry',
            service: 'VDI',
            priority: 'P1',
            vip: false,
            assignedTo: 'VDI-Operations',
            openDate: '2025-09-20 04:20',
            expectedCompletion: '2025-09-20 08:30',
            timeline: ['Opened', 'Assigned', 'Vendor Engaged'],
            resolutionHints: [
              'Capture Citrix session recording for analysis',
              'Move user to spare VDI host pool'
            ]
          },
          {
            id: 'INC-60202',
            user: 'rachel@org.com',
            title: 'VDI freezes when launching Bloomberg',
            service: 'VDI',
            priority: 'P2',
            vip: false,
            assignedTo: 'VDI-Operations',
            openDate: '2025-09-20 05:05',
            expectedCompletion: '2025-09-20 12:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Update VDI graphics acceleration package',
              'Throttle Bloomberg add-ons at startup'
            ]
          }
        ]
      },
      {
        issueSignature: 'vdi-profile-sync-delay',
        issueLabel: 'VDI profile sync delays',
        topic: 'Virtual Desktop',
        guidance: {
          type: 'resolution',
          title: 'Reduce profile load latency',
          steps: [
            'Purge stale FSLogix containers for the user and force reattach.',
            'Validate profile share capacity and latency for the affected region.',
            'Escalate to VDI storage team if load times stay above acceptable thresholds.'
          ]
        },
        tickets: [
          {
            id: 'INC-60203',
            user: 'steve@org.com',
            title: 'VDI profile taking 8 minutes to load',
            service: 'VDI',
            priority: 'P3',
            vip: false,
            assignedTo: 'VDI-Operations',
            openDate: '2025-09-20 06:40',
            expectedCompletion: '2025-09-21 06:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Purge stale FSLogix containers',
              'Add profile store capacity for APAC region'
            ]
          },
          {
            id: 'INC-60204',
            user: 'tina@org.com',
            title: 'VDI profile missing desktop shortcuts',
            service: 'VDI',
            priority: 'P3',
            vip: false,
            assignedTo: 'VDI-Operations',
            openDate: '2025-09-20 07:15',
            expectedCompletion: '2025-09-20 20:00',
            timeline: ['Opened', 'Assigned', 'Policy Refresh Triggered'],
            resolutionHints: [
              'Force GPO sync for VDI profile',
              'Restore missing shortcuts via automation'
            ]
          }
        ]
      },
      {
        issueSignature: 'password-reset-loop-portal',
        issueLabel: 'Password reset portal loops users',
        topic: 'Identity & Access',
        guidance: {
          type: 'maintenance',
          title: 'Password reset portal undergoing emergency hotfix',
          window: 'Change window: 03:30 - 06:00 ET',
          impact: 'Self-service password reset flows may loop after MFA approval.',
          action: 'Inform callers of the outage and complete resets manually until the window closes.'
        },
        tickets: [
          {
            id: 'INC-60301',
            user: 'uma@org.com',
            title: 'Self-service password reset loops back to login',
            service: 'Password Reset',
            priority: 'P2',
            vip: false,
            assignedTo: 'Identity-Tier2',
            openDate: '2025-09-20 03:55',
            expectedCompletion: '2025-09-20 09:30',
            timeline: ['Opened', 'Assigned', 'Fix Validated'],
            resolutionHints: [
              'Review Azure AD password reset policy logs',
              'Clear cached browser tokens before retry'
            ]
          },
          {
            id: 'INC-60302',
            user: 'victor@org.com',
            title: 'Password reset portal timed out after MFA',
            service: 'Password Reset',
            priority: 'P2',
            vip: false,
            assignedTo: 'Identity-Tier2',
            openDate: '2025-09-20 04:25',
            expectedCompletion: '2025-09-20 10:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Extend password reset transaction timeout',
              'Verify MFA callbacks from security service'
            ]
          }
        ]
      },
      {
        issueSignature: 'password-expiry-wave',
        issueLabel: 'Password expiry notification wave',
        topic: 'Identity & Access',
        guidance: {
          type: 'resolution',
          title: 'Manage password expiry surge',
          steps: [
            'Stage resets over multiple windows to reduce call spikes.',
            'Coordinate with desk leads about upcoming expiry cycles.',
            'Offer temporary extensions for high-priority or VIP users when required.'
          ]
        },
        tickets: [
          {
            id: 'INC-60303',
            user: 'will@org.com',
            title: 'Password expiry notice hitting whole desk',
            service: 'Password Reset',
            priority: 'P3',
            vip: false,
            assignedTo: 'Identity-Tier1',
            openDate: '2025-09-20 06:10',
            expectedCompletion: '2025-09-20 18:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Stage password resets over staggered windows',
              'Communicate planned expiry schedule to desk leads'
            ]
          },
          {
            id: 'INC-60304',
            user: 'xena@org.com',
            title: 'Password expiry locked out VIP assistant',
            service: 'Password Reset',
            priority: 'P1',
            vip: true,
            assignedTo: 'Identity-Tier2',
            openDate: '2025-09-20 06:55',
            expectedCompletion: '2025-09-20 08:45',
            timeline: ['Opened', 'Assigned', 'Escalated'],
            resolutionHints: [
              'Issue temporary password via secure channel',
              'Delay expiry policy for VIP cohort'
            ]
          }
        ]
      },
      {
        issueSignature: 'vpn-authentication-failures',
        issueLabel: 'VPN authentication failures and latency',
        topic: 'Remote Access & VPN',
        guidance: {
          type: 'resolution',
          title: 'Remediate VPN authentication incidents',
          steps: [
            'Resync or reprovision MFA tokens before retrying login.',
            'Review RADIUS logs for denial codes and take corrective action.',
            'Move user to an alternate VPN cluster if latency persists after fixes.'
          ]
        },
        tickets: [
          {
            id: 'INC-50155',
            user: 'kiran@org.com',
            title: 'VPN token fails on first-factor authentication',
            service: 'VPN',
            priority: 'P2',
            vip: false,
            assignedTo: 'Network-Access',
            openDate: '2025-09-20 04:45',
            expectedCompletion: '2025-09-20 10:30',
            timeline: ['Opened', 'Assigned', 'Awaiting User'],
            resolutionHints: [
              'Resync MFA token and clear cached credentials on client',
              'Verify radius authentication logs for rejection reason'
            ]
          },
          {
            id: 'INC-50157',
            user: 'devon@org.com',
            title: 'Remote desktop latency over VPN',
            service: 'VPN',
            priority: 'P3',
            vip: false,
            assignedTo: 'Network-Access',
            openDate: '2025-09-20 09:30',
            expectedCompletion: '2025-09-21 08:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Shift user to alternate VPN cluster with lower utilization',
              'Throttle high bandwidth processes detected on session'
            ]
          },
          {
            id: 'INC-50159',
            user: 'maria@org.com',
            title: 'GlobalProtect client stuck at verifying gateway',
            service: 'VPN',
            priority: 'P2',
            vip: false,
            assignedTo: 'Network-Access',
            openDate: '2025-09-20 11:05',
            expectedCompletion: '2025-09-21 07:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Reset GlobalProtect service and flush DNS cache',
              'Validate gateway certificate chain and client trust store'
            ]
          }
        ]
      },
      {
        issueSignature: 'vpn-performance-degradation',
        issueLabel: 'VPN performance degradation for APAC',
        topic: 'Remote Access & VPN',
        guidance: {
          type: 'maintenance',
          title: 'Capacity upgrade on APAC VPN gateways',
          window: 'Network change window: 05:00 - 13:00 local APAC',
          impact: 'Users may see reduced throughput while tunnels rebalance.',
          action: 'Route critical sessions to alternate regions and update callers on ETA.'
        },
        tickets: [
          {
            id: 'INC-60401',
            user: 'yara@org.com',
            title: 'APAC VPN users high latency after patch',
            service: 'VPN',
            priority: 'P2',
            vip: false,
            assignedTo: 'Network-Access',
            openDate: '2025-09-20 05:50',
            expectedCompletion: '2025-09-20 13:30',
            timeline: ['Opened', 'Assigned', 'Routing Adjusted'],
            resolutionHints: [
              'Shift APAC users to Sydney gateway',
              'Tune QoS for business-critical apps'
            ]
          },
          {
            id: 'INC-60402',
            user: 'zane@org.com',
            title: 'VPN throughput throttled at 5 Mbps',
            service: 'VPN',
            priority: 'P2',
            vip: false,
            assignedTo: 'Network-Access',
            openDate: '2025-09-20 06:35',
            expectedCompletion: '2025-09-20 12:00',
            timeline: ['Opened', 'Assigned', 'Capacity Added'],
            resolutionHints: [
              'Expand VPN gateway bandwidth pool',
              'Rebalance tunnels across regions'
            ]
          }
        ]
      },
      {
        issueSignature: 'device-performance-thermal',
        issueLabel: 'Laptop performance degradation after update',
        topic: 'Device Performance',
        guidance: {
          type: 'resolution',
          title: 'Stabilize post-update device performance',
          steps: [
            'Run vendor diagnostics and remediate thermal throttling issues.',
            'Clean vents and update BIOS or chipset drivers as needed.',
            'Confirm performance baseline via telemetry before closing ticket.'
          ]
        },
        tickets: [
          {
            id: 'INC-50126',
            user: 'anuj@org.com',
            title: 'Laptop running slow after security patch',
            service: 'Hardware',
            priority: 'P4',
            vip: false,
            assignedTo: 'DeskSide-DEL',
            openDate: '2025-09-19 08:00',
            expectedCompletion: '2025-09-19 12:00',
            timeline: ['Opened', 'Assigned', 'In Progress', 'Resolved'],
            resolutionHints: [
              'Run hardware diagnostics and remediate flagged issues',
              'Remove heavy startup applications and clear temp files'
            ]
          },
          {
            id: 'INC-50140',
            user: 'leah@org.com',
            title: 'Laptop fan constantly at high speed',
            service: 'Hardware',
            priority: 'P3',
            vip: false,
            assignedTo: 'DeskSide-NYC',
            openDate: '2025-09-20 05:50',
            expectedCompletion: '2025-09-20 16:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Update BIOS and thermal management drivers',
              'Clean vents and recalibrate thermal policy'
            ]
          },
          {
            id: 'INC-50141',
            user: 'sam@org.com',
            title: 'Frequent blue screen while undocking',
            service: 'Hardware',
            priority: 'P2',
            vip: false,
            assignedTo: 'DeskSide-DEL',
            openDate: '2025-09-20 07:10',
            expectedCompletion: '2025-09-20 18:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Collect mini-dump and analyze driver stack for docking station',
              'Reinstall graphics and chipset drivers from vendor package'
            ]
          },
          {
            id: 'INC-50148',
            user: 'vraj@org.com',
            title: 'Device encryption status not reporting',
            service: 'Endpoint Security',
            priority: 'P3',
            vip: false,
            assignedTo: 'DeskSide-DEL',
            openDate: '2025-09-18 11:20',
            expectedCompletion: '2025-09-21 15:00',
            timeline: ['Opened', 'Assigned', 'Awaiting User'],
            resolutionHints: [
              'Force BitLocker policy sync and refresh compliance state',
              'Validate TPM health and rotate recovery keys'
            ]
          }
        ]
      },
      {
        issueSignature: 'hardware-battery-drain',
        issueLabel: 'Hardware battery drain post patch',
        topic: 'Device Performance',
        guidance: {
          type: 'resolution',
          title: 'Address abnormal battery drain',
          steps: [
            'Calibrate battery firmware using the OEM utility.',
            'Disable power-hungry startup tasks introduced with the latest image.',
            'Roll back problematic chipset or power drivers if drain persists.'
          ]
        },
        tickets: [
          {
            id: 'INC-60501',
            user: 'amy@org.com',
            title: 'Laptop battery draining in 45 minutes',
            service: 'Hardware',
            priority: 'P2',
            vip: false,
            assignedTo: 'DeskSide-NYC',
            openDate: '2025-09-20 08:35',
            expectedCompletion: '2025-09-21 09:00',
            timeline: ['Opened', 'Assigned', 'Diagnostics Running'],
            resolutionHints: [
              'Calibrate battery firmware via vendor tool',
              'Disable power hungry startup tasks'
            ]
          },
          {
            id: 'INC-60502',
            user: 'ben@org.com',
            title: 'New image causing overheating and drain',
            service: 'Hardware',
            priority: 'P3',
            vip: false,
            assignedTo: 'DeskSide-DEL',
            openDate: '2025-09-20 09:15',
            expectedCompletion: '2025-09-21 11:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Roll back chipset driver update',
              'Apply latest BIOS thermal profile'
            ]
          }
        ]
      },
      {
        issueSignature: 'device-enrollment-failures',
        issueLabel: 'Device enrollment failures in Intune',
        topic: 'Endpoint Management',
        guidance: {
          type: 'resolution',
          title: 'Unblock Intune enrollment',
          steps: [
            'Resync the Intune enrollment profile for the affected device.',
            'Reset Company Portal cache and perform a fresh sign-in.',
            'Escalate to Endpoint Engineering if compliance evaluation still fails.'
          ]
        },
        tickets: [
          {
            id: 'INC-60601',
            user: 'cara@org.com',
            title: 'Device enrollment stuck at company portal',
            service: 'Device Management',
            priority: 'P3',
            vip: false,
            assignedTo: 'Endpoint-Operations',
            openDate: '2025-09-20 07:40',
            expectedCompletion: '2025-09-21 08:00',
            timeline: ['Opened', 'Assigned', 'Policy Refresh Triggered'],
            resolutionHints: [
              'Resync Intune enrollment profile',
              'Reset company portal cache and retry'
            ]
          },
          {
            id: 'INC-60602',
            user: 'dylan@org.com',
            title: 'Device enrollment fails compliance check',
            service: 'Device Management',
            priority: 'P2',
            vip: false,
            assignedTo: 'Endpoint-Operations',
            openDate: '2025-09-20 08:05',
            expectedCompletion: '2025-09-20 19:00',
            timeline: ['Opened', 'Assigned', 'Investigating'],
            resolutionHints: [
              'Verify device record in Azure AD',
              'Force compliance evaluation cycle'
            ]
          }
        ]
      },
      {
        issueSignature: 'endpoint-compliance-drift',
        issueLabel: 'Endpoint compliance drift detected',
        topic: 'Endpoint Security',
        guidance: {
          type: 'resolution',
          title: 'Recover endpoint compliance posture',
          steps: [
            'Run Defender compliance baseline remediation scripts.',
            'Refresh compliance state from the data lake for affected cohorts.',
            'Escalate to security engineering if drift exceeds 24 hours.'
          ]
        },
        tickets: [
          {
            id: 'INC-60701',
            user: 'ella@org.com',
            title: 'Endpoint compliance drifted after KB update',
            service: 'Endpoint Security',
            priority: 'P2',
            vip: false,
            assignedTo: 'Endpoint-Security',
            openDate: '2025-09-20 08:25',
            expectedCompletion: '2025-09-20 17:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Review Defender compliance baseline',
              'Trigger remediation script for drifted devices'
            ]
          },
          {
            id: 'INC-60702',
            user: 'farah@org.com',
            title: 'Compliance dashboard shows stale data',
            service: 'Endpoint Security',
            priority: 'P3',
            vip: false,
            assignedTo: 'Endpoint-Security',
            openDate: '2025-09-20 09:00',
            expectedCompletion: '2025-09-21 09:00',
            timeline: ['Opened', 'Assigned', 'Data Refresh Scheduled'],
            resolutionHints: [
              'Refresh compliance data lake ingestion',
              'Purge outdated cache entries in portal'
            ]
          }
        ]
      },
      {
        issueSignature: 'endpoint-encryption-reporting-gap',
        issueLabel: 'Endpoint encryption reporting gaps',
        topic: 'Endpoint Security',
        guidance: {
          type: 'maintenance',
          title: 'Encryption telemetry pipeline refresh',
          window: 'Data lake refresh: 07:00 - 11:00 ET',
          impact: 'Encryption dashboards may show unknown status for portions of the fleet.',
          action: 'Avoid manual key rotations during the refresh and notify stakeholders of reporting delay.'
        },
        tickets: [
          {
            id: 'INC-60703',
            user: 'george@org.com',
            title: 'Encryption status unknown for 50 devices',
            service: 'Endpoint Security',
            priority: 'P2',
            vip: false,
            assignedTo: 'Endpoint-Security',
            openDate: '2025-09-20 07:55',
            expectedCompletion: '2025-09-20 18:30',
            timeline: ['Opened', 'Assigned', 'Investigation Ongoing'],
            resolutionHints: [
              'Force BitLocker escrow sync',
              'Validate MBAM service health'
            ]
          },
          {
            id: 'INC-60704',
            user: 'hannah@org.com',
            title: 'Encryption report missing Mac fleet',
            service: 'Endpoint Security',
            priority: 'P3',
            vip: false,
            assignedTo: 'Endpoint-Security',
            openDate: '2025-09-20 10:10',
            expectedCompletion: '2025-09-21 12:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Refresh Jamf inventory ingestion',
              'Confirm FileVault keys escrowed correctly'
            ]
          }
        ]
      },
      {
        issueSignature: 'service-request-access-approvals',
        issueLabel: 'Service request approval backlog',
        topic: 'Service Requests',
        guidance: {
          type: 'maintenance',
          title: 'Access approvals paused for policy deployment',
          window: 'Planned change: 06:00 - 12:00 ET',
          impact: 'Approval SLAs extended while role templates reload.',
          action: 'Set customer expectation on delays and route urgent cases to duty manager.'
        },
        tickets: [
          {
            id: 'INC-60801',
            user: 'ian@org.com',
            title: 'Access service requests stuck awaiting approval',
            service: 'Service Request',
            priority: 'P3',
            vip: false,
            assignedTo: 'ServiceDesk-Approvals',
            openDate: '2025-09-20 06:50',
            expectedCompletion: '2025-09-20 22:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Expedite approvals via automation rule',
              'Notify approvers via Teams escalation'
            ]
          },
          {
            id: 'INC-60802',
            user: 'jane@org.com',
            title: 'Access request backlog for Finance apps',
            service: 'Service Request',
            priority: 'P2',
            vip: false,
            assignedTo: 'ServiceDesk-Approvals',
            openDate: '2025-09-20 07:30',
            expectedCompletion: '2025-09-20 20:00',
            timeline: ['Opened', 'Assigned', 'Escalated'],
            resolutionHints: [
              'Bulk approve requests with role template',
              'Add temporary approvers for Finance queue'
            ]
          }
        ]
      },
      {
        issueSignature: 'service-request-onboarding',
        issueLabel: 'Service requests for onboarding packages',
        topic: 'Service Requests',
        guidance: {
          type: 'resolution',
          title: 'Expedite onboarding fulfilment',
          steps: [
            'Trigger the onboarding kit workflow and verify logistics handoff.',
            'Audit RBAC automation to confirm required permissions applied.',
            'Coordinate with onboarding leads for any missing physical assets.'
          ]
        },
        tickets: [
          {
            id: 'INC-60803',
            user: 'kevin@org.com',
            title: 'Onboarding service requests missing hardware kit',
            service: 'Service Request',
            priority: 'P2',
            vip: false,
            assignedTo: 'ServiceDesk-Onboarding',
            openDate: '2025-09-20 08:45',
            expectedCompletion: '2025-09-21 13:00',
            timeline: ['Opened', 'Assigned'],
            resolutionHints: [
              'Trigger onboarding kit fulfillment workflow',
              'Sync ServiceNow task with logistics team'
            ]
          },
          {
            id: 'INC-60804',
            user: 'lara@org.com',
            title: 'Onboarding automation skipped permissions',
            service: 'Service Request',
            priority: 'P2',
            vip: false,
            assignedTo: 'ServiceDesk-Onboarding',
            openDate: '2025-09-20 09:20',
            expectedCompletion: '2025-09-21 10:00',
            timeline: ['Opened', 'Assigned', 'Automation Fix Deployed'],
            resolutionHints: [
              'Re-run onboarding automation for user',
              'Audit missing permissions via RBAC script'
            ]
          }
        ]
      }
    ]

    return clusterData.flatMap(cluster =>
      cluster.tickets.map(ticket => ({
        ...ticket,
        topic: ticket.topic ?? cluster.topic,
        issueSignature: cluster.issueSignature,
        issueLabel: cluster.issueLabel,
        guidance: cluster.guidance
      }))
    )
  }, [])

  const workflows = useMemo(() => ([
    {
      key:'resetPassword',
      title:'Reset Password',
      description:'Trigger self-service password reset with identity checks.',
      pinned:true,
      steps:[
        'Validate requester identity',
        'Reset password in directory',
        'Notify user with next steps'
      ]
    },
    {
      key:'repairOutlook',
      title:'Repair Outlook',
      description:'Rebuild Outlook profile and re-enable add-ins.',
      pinned:true,
      steps:[
        'Detect affected mailbox',
        'Rebuild Outlook profile',
        'Re-enable required add-ins',
        'Confirm client relaunch'
      ]
    },
    {
      key:'installZoomVDI',
      title:'Install Zoom VDI Plugin',
      description:'Check VDI and install plugin 3.2.1.',
      pinned:false,
      steps:[
        'Verify VDI compatibility',
        'Download Zoom VDI package',
        'Install plugin silently',
        'Validate plugin health'
      ]
    },
    {
      key:'provisionVPNToken',
      title:'Provision VPN Token',
      description:'Provision app-based MFA for VPN with QR.',
      pinned:false,
      steps:[
        'Validate MFA eligibility',
        'Generate new VPN token',
        'Send activation QR to user',
        'Confirm first login succeeds'
      ]
    }
  ]), [])

  const devices = useMemo(() => ([
    { id:'DEV-1001', type:'Laptop', name:'Dell Latitude 7420', status:'Healthy' },
    { id:'DEV-1002', type:'Smartphone', name:'iPhone 14 Pro', status:'Enrolled' }
  ]), [])

  const suggestions = useMemo(() => ([
    { id:'SUG-1', title:'Disk space low on Dell Latitude 7420', recommendation:'Clear temp files or extend storage.' },
    { id:'SUG-2', title:'Outlook add-in crash detected', recommendation:'Rebuild profile or disable faulty add-in.' }
  ]), [])

  const trainings = useMemo(() => ([
    { id:'TR-1', title:'Cybersecurity Awareness', due:'2024-10-15' },
    { id:'TR-2', title:'Data Privacy Basics', due:'2025-11-01' },
    { id:'TR-3', title:'Phishing Simulation Training', due:'2025-10-30' },
    { id:'TR-4', title:'Compliance & Regulatory Training', due:'2025-12-15' }
  ]), [])

  const knowledgeBase = useMemo(() => ([
    { id:'KB-201', title:'New Hire Onboarding Checklist', link:'https://kb.example.com/new-hire-checklist' },
    { id:'KB-205', title:'Install Required Productivity Suite', link:'https://kb.example.com/install-productivity-suite' },
    { id:'KB-207', title:'Set Up VPN Token (First Time)', link:'https://kb.example.com/new-joiner-vpn-token' },
    { id:'KB-210', title:'Enroll Devices in Company Portal', link:'https://kb.example.com/new-joiner-device-enroll' },
    { id:'KB-214', title:'Complete Mandatory Training Modules', link:'https://kb.example.com/new-joiner-training' },
    { id:'KB-217', title:'Request Software for Your Role', link:'https://kb.example.com/new-joiner-software-request' }
  ]), [])

  return { tickets, workflows, devices, suggestions, trainings, knowledgeBase }
}

function SectionTitle({ icon, title, extra }) {
  const Icon = icon
  return (
    <div className="flex items-center justify-between mb-2 mt-4">
      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        {Icon && <Icon className="w-4 h-4"/>}
        <span>{title}</span>
      </div>
      {extra && <span className="text-xs text-gray-500">{extra}</span>}
    </div>
  )
}

function DeviceCard({ d }){
  const Icon = d.type==='Laptop'?Laptop:Smartphone
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-600"/>
        <div>
          <div className="font-medium text-gray-800">{d.name}</div>
          <div className="text-xs text-gray-500">{d.type} · {d.status}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function SuggestionCard({ s, onOpen }){
  return (
    <Card className="bg-yellow-50 border border-yellow-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-yellow-800"><AlertTriangle className="w-4 h-4"/>{s.title}</div>
        <div className="text-xs text-yellow-700 mt-1">{s.recommendation}</div>
        <Button size="sm" className="mt-2" onClick={()=>onOpen(s)}>Open Ticket</Button>
      </CardContent>
    </Card>
  )
}

function WorkflowCard({ wf, onTogglePin, onRun, running }){
  return (
    <Card key={wf.key} className="bg-white border border-gray-200 p-3 flex justify-between items-start">
      <div>
        <div className="font-medium text-gray-800">{wf.title}</div>
        <div className="text-xs text-gray-500">{wf.description}</div>
      </div>
      <div className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1 py-1">
        <Button variant="outline" size="sm" className="border-slate-300" disabled={running} onClick={()=>onRun(wf)}>
          {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <Play className="w-4 h-4 mr-1"/>}
          {running ? 'Running...' : 'Run'}
        </Button>
        <Button variant="outline" size="sm" className="border-slate-300" onClick={()=>onTogglePin(wf.key)}>
          <Pin className={`w-4 h-4 ${wf.pinned ? 'text-blue-600' : 'text-gray-400'}`}/>
        </Button>
      </div>
    </Card>
  )
}

function WorkflowRunPanel({ run, log, onDismiss }){
  if (!run) return null

  const totalSteps = run.steps.length
  const completedSteps = run.status === 'completed' ? totalSteps : Math.max(run.stepIndex + 1, 0)
  const progress = Math.round((completedSteps / totalSteps) * 100)

  return (
    <Card className="bg-white border border-blue-200 shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
            <Clock3 className="w-4 h-4"/>
            {run.status === 'completed' ? 'Workflow Completed' : 'Workflow Running'}
          </CardTitle>
          {run.status === 'completed' && (
            <Button size="sm" variant="ghost" className="text-xs" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">{run.title}</div>
        <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
          <div className={`h-2 rounded-full ${run.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {run.steps.map((step, index) => {
            const isComplete = run.status === 'completed' || index < completedSteps
            const isActive = run.status !== 'completed' && index === completedSteps - 1
            const Icon = isComplete ? CheckCircle2 : Circle
            const iconClasses = isComplete
              ? 'text-green-500'
              : isActive
                ? 'text-blue-500'
                : 'text-gray-300'
            return (
              <div key={index} className="flex items-start gap-2 text-xs">
                <Icon className={`w-4 h-4 mt-[2px] ${iconClasses}`}/>
                <span className={`${isComplete ? 'text-gray-700' : isActive ? 'text-blue-700' : 'text-gray-500'}`}>{step}</span>
              </div>
            )
          })}
        </div>
        {!!log.length && (
          <div className="rounded-md border border-blue-100 bg-blue-50 p-2 text-[11px] text-blue-700 space-y-1">
            {log.map(entry => (
              <div key={entry.id}>• {entry.message}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TrainingCard({ t }){
  const isOverdue = useMemo(() => {
    const dueDate = new Date(t.due)
    if (Number.isNaN(dueDate.getTime())) return false
    const today = new Date()
    dueDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }, [t.due])

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="py-2.5 px-3 flex justify-between items-center">
        <div>
          <div className="font-medium text-gray-800">{t.title}</div>
          <div className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            Due: {t.due}
            {isOverdue && (
              <span className="ml-2 inline-flex items-center rounded-sm bg-red-100 px-2 py-[2px] text-[11px] text-red-700">
                Overdue
              </span>
            )}
          </div>
        </div>
        <Button size="sm" className="bg-black text-white hover:bg-black/80">Start</Button>
      </CardContent>
    </Card>
  )
}

function PizzaTracker({ ticket, onClose }){
  const stages = ["Opened","Assigned","In Progress","Resolved"]
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center">
        {stages.map((stage, i) => {
          const completed = ticket.timeline.includes(stage)
          const isLast = i === stages.length-1
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${completed?'bg-green-500 text-white':'bg-gray-300 text-gray-600'}`}>{i+1}</div>
              <div className="text-xs mt-1 text-gray-700">{stage}</div>
              <div className="h-1 w-full bg-gray-300">
                <div className={`h-1 ${completed || (isLast && ticket.timeline.includes("Resolved")) ? 'bg-green-500':'bg-gray-300'}`} style={{width:'100%'}}></div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" className="border-slate-300" onClick={()=>setShowDetails(!showDetails)}>{showDetails?"Hide Details":"Details"}</Button>
        {ticket.timeline.includes("Resolved") && <Button size="sm" variant="outline" className="border-slate-300" onClick={()=>onClose(ticket)}><XCircle className="w-4 h-4 mr-1"/>Close</Button>}
      </div>
      {showDetails && (
        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 space-y-1">
          <div><b>Assigned To:</b> {ticket.assignedTo}</div>
          <div><b>Opened:</b> {ticket.openDate}</div>
          <div><b>Expected Completion:</b> {ticket.expectedCompletion}</div>
        </div>
      )}
    </div>
  )
}

function AssistantsPanel({ showGuides = false, runbookTickets = [] }){
  const { tickets } = useMockData()
  const [input, setInput] = useState("")
  const [msgs, setMsgs] = useState([
    { role:'agent', text:'How can I help today?', time:'9:15 AM' }
  ])
  const [voiceState, setVoiceState] = useState('idle') // idle | routing | connected
  const [voiceStatus, setVoiceStatus] = useState('Tap connect to start a secure call session.')
  const [voiceSteps, setVoiceSteps] = useState([])
  const [showContext, setShowContext] = useState(false)
  const endRef = useRef(null)
  const voiceTimerRef = useRef()
  const [activeRunbookTicketId, setActiveRunbookTicketId] = useState(null)
  const resolutionTickets = useMemo(() => {
    if (!showGuides) return []
    const priorityRank = { P1: 1, P2: 2, P3: 3, P4: 4 }
    const source = runbookTickets !== undefined ? runbookTickets : tickets
    return source
      .filter(ticket => ticket.guidance?.type === 'resolution')
      .sort((a, b) => {
        const pa = priorityRank[a.priority] || 99
        const pb = priorityRank[b.priority] || 99
        if (pa !== pb) return pa - pb
        return a.id.localeCompare(b.id)
      })
      .slice(0, 6)
  }, [showGuides, runbookTickets, tickets])
  const activeRunbookTicket = useMemo(() => {
    if (!showGuides || !activeRunbookTicketId) return null
    return resolutionTickets.find(ticket => ticket.id === activeRunbookTicketId) || null
  }, [showGuides, resolutionTickets, activeRunbookTicketId])
  const activeRunbookSlug = useMemo(() => {
    if (!activeRunbookTicket) return ''
    const source = activeRunbookTicket.issueSignature || activeRunbookTicket.id
    return source.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  }, [activeRunbookTicket])
  useEffect(()=>{ endRef.current && endRef.current.scrollIntoView({behavior:'smooth'}) }, [msgs])

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!showGuides || !resolutionTickets.length) {
      if (activeRunbookTicketId !== null) setActiveRunbookTicketId(null)
      return
    }
    if (activeRunbookTicketId && !resolutionTickets.some(ticket => ticket.id === activeRunbookTicketId)) {
      setActiveRunbookTicketId(resolutionTickets[0].id)
    }
  }, [showGuides, resolutionTickets, activeRunbookTicketId])

  function connectVoice(){
    if (voiceState === 'idle') {
      setVoiceSteps([])
      setShowContext(false)
      setVoiceState('connected')
      setVoiceStatus('Connected with verified caller, running intake workflow...')

      const stagedSteps = [
        { id: 'route', message: 'Routing decision', description: 'Simple, explainable steps for trust & auditing' },
        { id: 'verify', message: 'Caller verified', description: 'Voice print + badge last‑4' },
        { id: 'intent', message: 'Intent detected: VPN issue', description: 'Caller said “VPN keeps dropping, need help.” · NLP score 0.94' },
        { id: 'knowledge', message: 'Knowledge & incidents checked', description: 'EMEA outage matched' },
        { id: 'route-team', message: 'Route to Network Ops', description: 'Queue: Priority 2 • wait ~3m' }
      ]

      stagedSteps.forEach((step, idx) => {
        const delay = step.id === 'intent' ? 2000 : 800
        voiceTimerRef.current = setTimeout(() => {
          setVoiceSteps(prev => [...prev, step])
          if (idx === stagedSteps.length - 1) {
            setVoiceState('routing')
            setVoiceStatus('Preparing context package for handoff...')
            setShowContext(true)
            voiceTimerRef.current = setTimeout(() => {
              setVoiceState('connected')
              setVoiceStatus('Workflow completed • Network Ops has the context package.')
            }, 1500)
          }
        }, (idx === 0 ? 500 : (idx === 1 ? 1000 : idx === 2 ? 1000 + delay : 1000 + delay + (idx - 2) * 800)))
      })
    } else if (voiceState === 'connected') {
      setVoiceState('idle')
      setVoiceStatus('Call ended. Tap connect to start a new session.')
      setVoiceSteps([])
      setShowContext(false)
    }
  }

  const isRouting = voiceState === 'routing'
  const isConnected = voiceState === 'connected'

  const runbookMessages = useMemo(() => {
    if (!showGuides || !activeRunbookTicket) return []
    const steps = activeRunbookTicket.guidance?.steps || []
    const baseTime = new Date()
    const formatTime = offset => new Date(baseTime.getTime() + offset * 60000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const chips = [
      `Priority ${activeRunbookTicket.priority}`,
      `Service ${activeRunbookTicket.service}`,
      `Assigned ${activeRunbookTicket.assignedTo}`
    ]
    const conversation = [
      {
        role: 'user',
        text: `${activeRunbookTicket.title}`,
        meta: [`Ticket ${activeRunbookTicket.id}`, activeRunbookTicket.user],
        time: formatTime(0)
      },
      {
        role: 'agent',
        text: `Acknowledged. I'll walk through the approved runbook for ${activeRunbookTicket.service}.`,
        chips,
        time: formatTime(1)
      }
    ]

    steps.forEach((step, index) => {
      conversation.push({
        role: 'agent',
        text: `Step ${index + 1}: ${step}`,
        commands: [`runbook exec ${activeRunbookSlug} --step ${index + 1}`],
        time: formatTime(index + 2)
      })
    })

    if (activeRunbookTicket.guidance?.notes) {
      conversation.push({
        role: 'agent',
        text: activeRunbookTicket.guidance.notes,
        time: formatTime(steps.length + 2)
      })
    }

    conversation.push({
      role: 'agent',
      text: `Runbook complete. Close the loop with ${activeRunbookTicket.assignedTo} once validation is finished.`,
      time: formatTime(steps.length + 3)
    })

    return conversation
  }, [showGuides, activeRunbookTicket, activeRunbookSlug])

  const messagesToRender = showGuides && activeRunbookTicket ? runbookMessages : msgs

  function send(){
    if(!input.trim()) return
    const message = { role:'user', text:input.trim(), time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }
    setMsgs(prev => [...prev, message])
    setInput("")
    setTimeout(() => {
      setMsgs(prev => [...prev, { role:'agent', text:'Thanks, I’m routing that to our automation now.', time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }])
    }, 800)
  }

  return (
    <div className="space-y-3">
      <SectionTitle icon={MessagesSquare} title="Assistants" />

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Mic className="w-4 h-4 text-blue-600"/>
            Voice Agent
          </CardTitle>
          <p className="text-xs text-gray-500">Hands-free help with secure caller verification</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className={`text-white ${isConnected || isRouting ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-black/80'}`}
              onClick={connectVoice}
            >
              <Mic className="w-4 h-4 mr-1"/>
              {isConnected || isRouting ? 'End Call' : 'Connect'}
            </Button>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${(isConnected || isRouting) ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              <BadgeCheck className="w-3 h-3 mr-1"/>{(isConnected || isRouting) ? 'Verified caller' : 'Verification ready'}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${isRouting ? 'bg-blue-50 text-blue-700' : isConnected ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              <Clock3 className="w-3 h-3 mr-1"/>
              {isRouting ? 'Routing' : isConnected ? 'Live' : 'Idle'}
            </span>
          </div>
          <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/50 px-3 py-2 text-[11px] text-blue-700">
            {voiceStatus}
          </div>
          {!!voiceSteps.length && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
              {voiceSteps.map(step => (
                <div key={step.id} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-[2px]"/>
                  <div>
                    <div className="font-medium text-gray-800">{step.message}</div>
                    <div className="text-[11px] text-gray-500">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showContext && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800 space-y-2">
              <div className="font-semibold text-blue-900">Context package</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] uppercase text-blue-500">User</div>
                  <div className="font-medium text-blue-900">EMP41267 (Anuj G)</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-blue-500">Location</div>
                  <div className="font-medium text-blue-900">London</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-blue-500">Last success</div>
                  <div className="font-medium text-blue-900">Today 08:02</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-blue-500">Device</div>
                  <div className="font-medium text-blue-900">Win11 Laptop</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600"/>
            {showGuides ? 'Copilot Conversation' : 'Amelia (Chat Assistant)'}
          </CardTitle>
          <p className="text-xs text-gray-500">{showGuides ? 'Same request, handled fully in chat' : 'Understands policy and can take action in systems'}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {showGuides && (
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ticket #</div>
                {activeRunbookTicket && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Ticket {activeRunbookTicket.id}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{activeRunbookTicket.user}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-0.75 rounded-xl border border-slate-200 bg-white/70 p-1.5">
                {resolutionTickets.map(ticket => {
                  const isActive = ticket.id === activeRunbookTicketId
                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setActiveRunbookTicketId(ticket.id)}
                      className={`inline-flex items-center rounded-md border px-[3.5px] py-0.5 text-[6.5px] font-medium tracking-tight transition-colors ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:text-slate-900'}`}
                    >
                      {ticket.id}
                    </button>
                  )
                })}
                {!resolutionTickets.length && (
                  <span className="text-xs text-slate-500">No resolution runbooks available.</span>
                )}
              </div>
            </div>
          )}

          <ScrollArea className="h-[420px] rounded-xl border border-slate-100 bg-slate-50/60 p-3">
            <div className="space-y-3">
              {messagesToRender.map((m, idx) => {
                const isUser = m.role === 'user'
                return (
                  <div key={idx} className={`max-w-[85%] ${isUser ? 'ml-auto text-right' : ''}`}>
                    <div className={`inline-flex flex-col rounded-2xl px-3 py-2 text-sm ${isUser ? 'bg-slate-200 text-gray-800' : 'bg-white text-gray-900 border border-slate-200'}`}>
                      <span>{m.text}</span>
                      {m.meta && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.meta.map((item, metaIdx) => (
                            <span key={metaIdx} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {m.chips && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.chips.map((chip, chipIdx) => (
                            <span key={chipIdx} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                      {m.commands && (
                        <div className="mt-2 space-y-1">
                          {m.commands.map((cmd, cmdIdx) => (
                            <div key={cmdIdx} className="rounded bg-slate-900 px-2 py-1 font-mono text-[11px] text-slate-100">
                              {cmd}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`mt-1 text-[11px] text-gray-400 ${isUser ? '' : 'text-left'}`}>{m.time}</div>
                  </div>
                )
              })}
              <div ref={endRef}/>
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder={showGuides ? 'Runbook preview — chat disabled' : 'Ask or type — for commands'}
              disabled={showGuides}
            />
            <Button
              onClick={send}
              className="bg-black text-white hover:bg-black/80"
              disabled={showGuides}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EndUserPortal(){
  const { tickets, workflows, devices, suggestions, trainings, knowledgeBase } = useMockData()
  const [ticketList, setTicketList] = useState(tickets)
  const [search, setSearch] = useState("")
  const [workflowList, setWorkflowList] = useState(workflows)
  const [runningWorkflow, setRunningWorkflow] = useState(null)
  const [activeRun, setActiveRun] = useState(null)
  const [runLog, setRunLog] = useState([])
  const runTimersRef = useRef([])

  useEffect(() => {
    return () => {
      runTimersRef.current.forEach(clearTimeout)
    }
  }, [])

  function openTicket(s){
    alert(`Ticket opened: ${s.title}`)
  }

  function closeTicket(ticket){
    setTicketList(ticketList.filter(t=>t.id!==ticket.id))
  }

  function togglePin(key){
    setWorkflowList(workflowList.map(w=> w.key===key ? {...w, pinned:!w.pinned}: w))
  }

  function runWorkflow(wf){
    runTimersRef.current.forEach(clearTimeout)
    runTimersRef.current = []

    setActiveRun({
      key: wf.key,
      title: wf.title,
      steps: wf.steps,
      status: 'running',
      stepIndex: -1
    })
    setRunLog([{ id: `${wf.key}-start`, message: `Started ${wf.title}` }])
    setRunningWorkflow(wf.key)

    wf.steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setRunLog(prev => [...prev, { id: `${wf.key}-step-${index}`, message: step }])
        setActiveRun(prev => prev ? { ...prev, stepIndex: index } : prev)

        if (index === wf.steps.length - 1) {
          const completeTimer = setTimeout(() => {
            setRunLog(prev => [...prev, { id: `${wf.key}-done`, message: 'Workflow completed successfully' }])
            setRunningWorkflow(null)
            setActiveRun(prev => prev ? { ...prev, status: 'completed', stepIndex: index } : prev)
          }, 700)
          runTimersRef.current.push(completeTimer)
        }
      }, (index + 1) * 1200)
      runTimersRef.current.push(timer)
    })
  }

  function dismissRunPanel(){
    setActiveRun(null)
    setRunLog([])
  }

  const pinnedWorkflows = workflowList.filter(w=>w.pinned)
  const filteredWorkflows = workflowList.filter(w=>w.title.toLowerCase().includes(search.toLowerCase()) && (!search || !w.pinned))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1.8fr)_420px] gap-4 items-start w-full">
      <div className="space-y-3">
        <SectionTitle icon={Search} title="Search Workflows" />
        <Input placeholder="Search workflows..." value={search} onChange={e=>setSearch(e.target.value)} />
        {search && (
          <div className="space-y-2 mt-2">
            {filteredWorkflows.map(wf => (
              <WorkflowCard key={wf.key} wf={wf} onTogglePin={togglePin} onRun={runWorkflow} running={runningWorkflow===wf.key}/>
            ))}
          </div>
        )}

        <SectionTitle icon={Layers} title="Pinned Workflows" />
        {pinnedWorkflows.map(wf => (
          <WorkflowCard key={wf.key} wf={wf} onTogglePin={togglePin} onRun={runWorkflow} running={runningWorkflow===wf.key}/>
        ))}

        <WorkflowRunPanel run={activeRun} log={runLog} onDismiss={dismissRunPanel}/>

        <SectionTitle icon={Laptop} title="My Devices" />
        <div className="space-y-2">
          {devices.map(d=>(<DeviceCard key={d.id} d={d}/>))}
        </div>

        <SectionTitle icon={AlertTriangle} title="System Suggestions" />
        <div className="space-y-2">
          {suggestions.map(s=>(<SuggestionCard key={s.id} s={s} onOpen={openTicket}/>))}
        </div>
      </div>
      <div className="space-y-3">
        <SectionTitle icon={BookOpen} title="My Trainings" extra={`${trainings.length} trainings pending`} />
        <ScrollArea className="h-56 rounded-md border border-gray-200 p-2 bg-gray-50">
          <div className="space-y-2">
            {trainings.map(t=>(<TrainingCard key={t.id} t={t}/>))}
          </div>
        </ScrollArea>

        <SectionTitle icon={FileText} title="Knowledge Base For You" extra={`${knowledgeBase.length} articles`} />
        <ScrollArea className="h-56 rounded-md border border-gray-200 p-2 bg-gray-50">
          <div className="text-sm">
            {knowledgeBase.map(article => (
              <div
                key={article.id}
                className="flex items-center justify-between py-2 px-1 border-b border-gray-200 last:border-b-0"
              >
                <span className="mr-4 flex-1 truncate text-gray-800 font-medium" title={article.title}>{article.title}</span>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SectionTitle icon={Ticket} title="My Tickets" />
        {ticketList.filter(t=>t.user==='anuj@org.com').map(t=>(
          <Card key={t.id} className="bg-white border border-gray-200 p-3">
            <div className="font-medium text-gray-800">{t.id} · {t.title}</div>
            <PizzaTracker ticket={t} onClose={closeTicket}/>
          </Card>
        ))}
      </div>
      <div className="self-start w-full">
        <AssistantsPanel/>
      </div>
    </div>
  )
}

function AgentPortal(){
  const { tickets } = useMockData()
  const queueSummary = useMemo(() => ([
    { name: 'Priority 1', waiting: 2, oldest: '4m' },
    { name: 'Priority 2', waiting: 6, oldest: '12m' },
    { name: 'Service Requests', waiting: 9, oldest: '18m' }
  ]), [])

  const [expandedTickets, setExpandedTickets] = useState(() => new Set())
  const [collapsedClusters, setCollapsedClusters] = useState(() => {
    const initial = new Set()
    tickets.forEach(ticket => {
      const key = ticket.issueSignature || ticket.issueLabel || ticket.title
      initial.add(key)
    })
    return initial
  })
  const knownClustersRef = useRef(new Set(Array.from(collapsedClusters)))
  const [clusterQuery, setClusterQuery] = useState('Zoom')
  const [isClusterFilterOpen, setIsClusterFilterOpen] = useState(false)
  const [clusterFilterSearch, setClusterFilterSearch] = useState('')
  const clusterFilterContainerRef = useRef(null)
  const [expandedGuidanceTickets, setExpandedGuidanceTickets] = useState(() => new Set())
  const [priorityFilter, setPriorityFilter] = useState('P1')
  const priorityFilterOptions = ['ALL', 'P1', 'P2', 'P3']
  const clusterQuickFilters = useMemo(() => ['All', ...AGENT_CLUSTER_KEYWORDS], [])
  const normalizedClusterQuery = clusterQuery.trim().toLowerCase()
  const hasActiveClusterQuery = normalizedClusterQuery !== '' && normalizedClusterQuery !== 'all'
  const filteredClusterFilters = useMemo(() => {
    const term = clusterFilterSearch.trim().toLowerCase()
    if (!term) return clusterQuickFilters
    const matches = clusterQuickFilters.slice(1).filter(keyword => keyword.toLowerCase().includes(term))
    return ['All', ...matches]
  }, [clusterFilterSearch, clusterQuickFilters])
  const selectedFilterLabel = hasActiveClusterQuery
    ? clusterQuickFilters.find(keyword => keyword.toLowerCase() === normalizedClusterQuery) || clusterQuery
    : 'All'

  const { ticketsByUser, priorityCounts } = useMemo(() => {
    const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 }
    const grouped = new Map()

    tickets.forEach(ticket => {
      const key = ticket.user
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key).push(ticket)
    })

    const formatUser = email => {
      const handle = email.split('@')[0]
      return handle
        .replace(/[._]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(part => part[0]?.toUpperCase() + part.slice(1))
        .join(' ') || email
    }

    const baseGroups = Array.from(grouped.entries()).map(([userEmail, userTickets]) => {
      const sorted = [...userTickets].sort((a, b) => {
        const pa = priorityOrder[a.priority] || 99
        const pb = priorityOrder[b.priority] || 99
        if (pa !== pb) return pa - pb
        return new Date(b.openDate) - new Date(a.openDate)
      })
      const topPriorityLabel = sorted[0]?.priority || 'P4'
      const topPriority = priorityOrder[topPriorityLabel] || 99
      const hasMaintenance = sorted.some(ticket => ticket.guidance?.type === 'maintenance')
      return {
        user: userEmail,
        displayName: formatUser(userEmail),
        tickets: sorted,
        topPriority,
        topPriorityLabel,
        hasMaintenance
      }
    })

    const sortGroups = groups =>
      groups.sort((a, b) => {
        if (a.topPriority !== b.topPriority) return a.topPriority - b.topPriority
        return a.user.localeCompare(b.user)
      })

    const maintenanceGroups = sortGroups(baseGroups.filter(group => group.hasMaintenance))
    const regularGroups = sortGroups(baseGroups.filter(group => !group.hasMaintenance))

    const maintenancePool = [...maintenanceGroups]
    const resolutionPool = [...regularGroups]
    const maintenanceQuota = 4
    const resolutionQuota = 4
    const desiredPriorityCounts = { P1: 3, P2: 3, P3: 2 }
    const selectedPriorityCounts = { P1: 0, P2: 0, P3: 0 }
    const selected = []
    const usedUsers = new Set()
    let maintenanceSelected = 0
    let resolutionSelected = 0

    const takeFromPool = (pool, label, type) => {
      for (let index = 0; index < pool.length; index += 1) {
        const group = pool[index]
        if (!group) continue
        const groupLabel = group.topPriorityLabel || 'P4'
        if (groupLabel !== label) continue
        if (usedUsers.has(group.user)) continue

        pool.splice(index, 1)
        usedUsers.add(group.user)
        selected.push(group)
        selectedPriorityCounts[label] += 1
        if (type === 'maintenance') maintenanceSelected += 1
        if (type === 'resolution') resolutionSelected += 1
        return true
      }
      return false
    }

    const priorityOrderList = Object.keys(desiredPriorityCounts)

    priorityOrderList.forEach(label => {
      const target = desiredPriorityCounts[label]
      while (selectedPriorityCounts[label] < target) {
        let taken = false
        if (maintenanceSelected < maintenanceQuota) {
          taken = takeFromPool(maintenancePool, label, 'maintenance')
        }
        if (!taken && resolutionSelected < resolutionQuota) {
          taken = takeFromPool(resolutionPool, label, 'resolution')
        }
        if (!taken) {
          taken = takeFromPool(maintenancePool, label, 'maintenance') || takeFromPool(resolutionPool, label, 'resolution')
        }
        if (!taken) {
          break
        }
      }
    })

    const counts = {
      ALL: selected.length,
      P1: selectedPriorityCounts.P1,
      P2: selectedPriorityCounts.P2,
      P3: selectedPriorityCounts.P3
    }

    const filtered = priorityFilter === 'ALL'
      ? selected
      : selected.filter(group => group.tickets.some(ticket => ticket.priority === priorityFilter))

    return {
      ticketsByUser: filtered,
      priorityCounts: counts
    }
  }, [tickets, priorityFilter])

  const resolutionTicketsForAmelia = useMemo(() => {
    if (priorityFilter === 'P2') return []
    const collected = []
    const seen = new Set()
    for (const group of ticketsByUser) {
      for (const ticket of group.tickets) {
        if (
          ticket.guidance?.type === 'resolution' &&
          ticket.priority !== 'P2' &&
          (priorityFilter === 'ALL' || ticket.priority === priorityFilter) &&
          !seen.has(ticket.id)
        ) {
          collected.push(ticket)
          seen.add(ticket.id)
          if (collected.length >= 6) break
        }
      }
      if (collected.length >= 6) break
    }
    return collected
  }, [ticketsByUser, priorityFilter])

  useEffect(() => {
    const validTicketIds = new Set(tickets.map(ticket => ticket.id))
    setExpandedGuidanceTickets(prev => {
      let mutated = false
      const next = new Set()
      prev.forEach(id => {
        if (validTicketIds.has(id)) {
          next.add(id)
        } else {
          mutated = true
        }
      })
      return mutated ? next : prev
    })
  }, [tickets])

  const ticketsByIssue = useMemo(() => {
    const grouped = new Map()

    tickets.forEach(ticket => {
      const issueKey = ticket.issueSignature || ticket.issueLabel || ticket.title
      if (!grouped.has(issueKey)) {
        grouped.set(issueKey, {
          issueSignature: issueKey,
          issueLabel: ticket.issueLabel || ticket.title,
          topic: ticket.topic || null,
          services: new Set(),
          tickets: [],
          resolutionHints: new Set(),
          guidance: ticket.guidance || null
        })
      }

      const entry = grouped.get(issueKey)
      if (ticket.service) entry.services.add(ticket.service)
      entry.tickets.push(ticket)

      if (Array.isArray(ticket.resolutionHints)) {
        ticket.resolutionHints.forEach(hint => entry.resolutionHints.add(hint))
      } else if (ticket.possibleResolution) {
        entry.resolutionHints.add(ticket.possibleResolution)
      }
    })

    return Array.from(grouped.values())
      .map(entry => ({
        issueSignature: entry.issueSignature,
        issueLabel: entry.issueLabel,
        topic: entry.topic,
        services: Array.from(entry.services),
        tickets: entry.tickets,
        resolutionHints: Array.from(entry.resolutionHints),
        guidance: entry.guidance
      }))
      .sort((a, b) => {
        if (b.tickets.length !== a.tickets.length) return b.tickets.length - a.tickets.length
        return a.issueLabel.localeCompare(b.issueLabel)
      })
  }, [tickets])

  const displayedIssueGroups = useMemo(() => {
    if (!hasActiveClusterQuery) return ticketsByIssue

    return ticketsByIssue.filter(issue => {
      const labelMatch = issue.issueLabel?.toLowerCase().includes(normalizedClusterQuery)
      const topicMatch = issue.topic?.toLowerCase().includes(normalizedClusterQuery)
      const servicesMatch = issue.services.some(service => service?.toLowerCase().includes(normalizedClusterQuery))
      const hintsMatch = issue.resolutionHints.some(hint => hint?.toLowerCase().includes(normalizedClusterQuery))

      if (labelMatch || topicMatch || servicesMatch || hintsMatch) return true

      return issue.tickets.some(ticket => {
        return (
          ticket.title?.toLowerCase().includes(normalizedClusterQuery) ||
          ticket.service?.toLowerCase().includes(normalizedClusterQuery)
        )
      })
    })
  }, [hasActiveClusterQuery, normalizedClusterQuery, ticketsByIssue])

  useEffect(() => {
    const allSignatures = ticketsByIssue.map(issue => issue.issueSignature)
    setCollapsedClusters(prev => {
      let updated = false
      let next = prev

      allSignatures.forEach(sig => {
        if (!knownClustersRef.current.has(sig)) {
          if (next === prev) next = new Set(prev)
          next.add(sig)
          knownClustersRef.current.add(sig)
          updated = true
        }
      })

      const knownSignatures = Array.from(knownClustersRef.current)
      knownSignatures.forEach(sig => {
        if (!allSignatures.includes(sig)) {
          knownClustersRef.current.delete(sig)
          if (next === prev) next = new Set(prev)
          next.delete(sig)
          updated = true
        }
      })

      return updated ? next : prev
    })
  }, [ticketsByIssue, setCollapsedClusters])

  useEffect(() => {
    if (!isClusterFilterOpen) return

    const handleClickAway = event => {
      if (!clusterFilterContainerRef.current) return
      if (!clusterFilterContainerRef.current.contains(event.target)) {
        setIsClusterFilterOpen(false)
      }
    }

    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsClusterFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickAway)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickAway)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isClusterFilterOpen])

  useEffect(() => {
    if (!isClusterFilterOpen && clusterFilterSearch) {
      setClusterFilterSearch('')
    }
  }, [isClusterFilterOpen, clusterFilterSearch])

  const toggleTicketDetails = ticketId => {
    setExpandedTickets(prev => {
      const next = new Set(prev)
      if (next.has(ticketId)) {
        next.delete(ticketId)
      } else {
        next.add(ticketId)
      }
      return next
    })
  }

  const toggleCluster = issueSignature => {
    setCollapsedClusters(prev => {
      const next = new Set(prev)
      if (next.has(issueSignature)) {
        next.delete(issueSignature)
      } else {
        next.add(issueSignature)
      }
      return next
    })
  }

  const toggleGuidancePanel = ticketId => {
    setExpandedGuidanceTickets(prev => {
      const next = new Set(prev)
      if (next.has(ticketId)) {
        next.delete(ticketId)
      } else {
        next.add(ticketId)
      }
      return next
    })
  }

  const applyClusterQuickFilter = keyword => {
    if (keyword === 'All') {
      setClusterQuery('')
    } else {
      setClusterQuery(keyword)
    }
    setIsClusterFilterOpen(false)
    setClusterFilterSearch('')
  }

  const totalClusters = ticketsByIssue.length
  const visibleClusters = displayedIssueGroups.length
  const clusterSummaryLabel = hasActiveClusterQuery
    ? `${visibleClusters}/${totalClusters} clusters`
    : `${totalClusters} clusters`
  const noClusterMatches = hasActiveClusterQuery && visibleClusters === 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1.8fr)_420px] gap-4 items-start w-full">
      <div className="space-y-3">
        <SectionTitle icon={Ticket} title="Incident Cluster Intelligence" extra={clusterSummaryLabel} />
        <div className="space-y-3">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter incident clusters</span>
              {hasActiveClusterQuery && (
                <button
                  type="button"
                  onClick={() => applyClusterQuickFilter('All')}
                  className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  Clear
                </button>
              )}
            </div>
            <div ref={clusterFilterContainerRef} className="w-full">
              <button
                type="button"
                onClick={() => setIsClusterFilterOpen(prev => !prev)}
                className={`flex w-full items-center justify-between rounded-full border px-4 py-2 text-sm font-medium transition-colors ${hasActiveClusterQuery ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'}`}
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  {selectedFilterLabel === 'All' ? 'All incident clusters' : selectedFilterLabel}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isClusterFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isClusterFilterOpen && (
                <div className="mt-3 w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-3">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 focus-within:border-blue-400">
                      <Search className="h-4 w-4 text-slate-400" />
                      <Input
                        type="text"
                        autoFocus
                        value={clusterFilterSearch}
                        onChange={event => setClusterFilterSearch(event.target.value)}
                        placeholder="Search services or keywords"
                        className="h-7 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-2">
                    {filteredClusterFilters.map(keyword => {
                      const isActive = keyword === 'All'
                        ? !hasActiveClusterQuery
                        : normalizedClusterQuery === keyword.toLowerCase()
                      return (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => applyClusterQuickFilter(keyword)}
                          className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <span>{keyword}</span>
                          {isActive && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                        </button>
                      )
                    })}
                    {filteredClusterFilters.length === 0 && (
                      <div className="px-4 py-3 text-xs text-slate-500">No matching filters.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {noClusterMatches && (
            <Card className="border border-dashed border-slate-300 bg-slate-50/80">
              <CardContent className="py-8 text-center text-sm text-slate-500">
                No incident clusters for "{selectedFilterLabel}". Try another service keyword.
              </CardContent>
            </Card>
          )}

          {displayedIssueGroups.map(issueGroup => {
            const isCollapsed = collapsedClusters.has(issueGroup.issueSignature)
            const panelId = `cluster-panel-${issueGroup.issueSignature}`
            return (
              <Card
                key={issueGroup.issueSignature}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => toggleCluster(issueGroup.issueSignature)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${isCollapsed ? 'bg-slate-50 hover:bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
                    aria-expanded={!isCollapsed}
                    aria-controls={panelId}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{issueGroup.issueLabel}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        {issueGroup.topic && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                            {issueGroup.topic}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">Correlation ID: {issueGroup.issueSignature}</span>
                        {!!issueGroup.services.length && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            Services: {issueGroup.services.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {issueGroup.tickets.length} tickets
                      </span>
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div
                      id={panelId}
                      className="space-y-3 border-t border-slate-100 bg-white px-4 py-4 text-xs text-gray-600"
                    >
                      {issueGroup.tickets.map(ticket => {
                        const isExpanded = expandedTickets.has(ticket.id)
                        return (
                          <div
                            key={ticket.id}
                            className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div
                                  className="truncate font-medium text-gray-900"
                                  title={`${ticket.id} · ${ticket.title}`}
                                >
                                  {ticket.id} · {ticket.title}
                                </div>
                                <div className="mt-1 text-[11px] text-gray-500">Service: {ticket.service}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ticket.priority.startsWith('P1') ? 'border-red-200 text-red-600' : ticket.priority.startsWith('P2') ? 'border-orange-200 text-orange-600' : 'border-slate-200 text-slate-500'}`}
                                >
                                  {ticket.priority}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] text-blue-700 hover:text-blue-800"
                                  onClick={() => toggleTicketDetails(ticket.id)}
                                >
                                  {isExpanded ? 'Hide details' : 'View details'}
                                  {isExpanded ? (
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="mt-3 space-y-2 text-[11px] text-gray-600">
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                    Assigned: {ticket.assignedTo}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                    Opened: {ticket.openDate}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                    ETA: {ticket.expectedCompletion}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {ticket.timeline.map((stage, index) => (
                                    <span
                                      key={`${ticket.id}-${index}`}
                                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600"
                                    >
                                      {stage}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {!!issueGroup.resolutionHints.length && (
                        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/60 px-3 py-2">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                            Shared resolution hints
                          </div>
                          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-blue-900">
                            {issueGroup.resolutionHints.map((hint, index) => (
                              <li key={index}>{hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        <SectionTitle icon={AlertTriangle} title="Watchlist Signals" />
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-3 space-y-2 text-xs text-gray-600">
            <div><b>Database failover window</b> closes in 25 minutes.</div>
            <div><b>High VIP volume</b> detected in AMER region.</div>
            <div><b>Change freeze</b> starts tonight 22:00 local.</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle icon={UserCircle2} title="Tickets Assigned" extra={`${ticketsByUser.length} profiles`} />
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter ticket priorities</div>
          <div className="flex gap-0.5 flex-nowrap overflow-x-auto whitespace-nowrap pr-0.5">
            {priorityFilterOptions.map(option => {
              const isActive = priorityFilter === option
              const count = option === 'ALL' ? priorityCounts.ALL : (priorityCounts[option] || 0)
              const isDisabled = !isActive && option !== 'ALL' && count === 0
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPriorityFilter(option)}
                  disabled={isDisabled}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${isActive ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : isDisabled ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'}`}
                >
                  <span>{option === 'ALL' ? 'All' : option}</span>
                  <span className="text-[10px]">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
        {ticketsByUser.map(group => {
          const topPriorityLabel = group.tickets[0]?.priority || 'P4'
          const topPriorityClass = topPriorityLabel.startsWith('P1')
            ? 'bg-red-50 text-red-600 border border-red-200'
            : topPriorityLabel.startsWith('P2')
            ? 'bg-orange-50 text-orange-600 border border-orange-200'
            : 'bg-slate-100 text-slate-600 border border-slate-200'

          return (
            <Card key={group.user} className="bg-white border border-gray-200">
              <CardContent className="p-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{group.displayName}</div>
                    <div className="text-xs text-gray-500">{group.user}</div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${topPriorityClass}`}>
                    Highest {topPriorityLabel}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.tickets.map(ticket => {
                    const guidance = ticket.guidance
                    const isMaintenance = guidance?.type === 'maintenance'
                    const resolutionSteps = guidance?.steps?.length ? guidance.steps : ticket.resolutionHints || []
                    const isExpanded = expandedGuidanceTickets.has(ticket.id)
                    return (
                      <div key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{ticket.title}</div>
                            <div className="mt-1 text-xs text-gray-500">{ticket.id} · Service: {ticket.service}</div>
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ticket.priority.startsWith('P1') ? 'border-red-200 text-red-600' : ticket.priority.startsWith('P2') ? 'border-orange-200 text-orange-600' : 'border-slate-300 text-slate-500'}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500">Opened {ticket.openDate} · ETA {ticket.expectedCompletion}</div>

                        {isMaintenance ? (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Maintenance Notice</div>
                            {guidance?.title && <div className="text-sm font-medium text-amber-800">{guidance.title}</div>}
                            {guidance?.window && <div>Window: {guidance.window}</div>}
                            {guidance?.impact && <div>Impact: {guidance.impact}</div>}
                            {guidance?.action && <div className="font-semibold text-amber-900">Action: {guidance.action}</div>}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Resolution Path</div>
                              <button
                                type="button"
                                onClick={() => toggleGuidancePanel(ticket.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 transition-colors hover:border-emerald-200 hover:bg-emerald-100"
                              >
                                {isExpanded ? 'Hide' : 'View'}
                                <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                            {!isExpanded && resolutionSteps.length > 0 && (
                              <div className="text-emerald-900">{resolutionSteps[0]}</div>
                            )}
                            {isExpanded && (
                              <div className="space-y-2">
                                {resolutionSteps.length > 0 && (
                                  <ul className="list-inside list-disc space-y-1 text-emerald-900">
                                    {resolutionSteps.map((step, index) => (
                                      <li key={index}>{step}</li>
                                    ))}
                                  </ul>
                                )}
                                {guidance?.notes && <div className="text-emerald-900">{guidance.notes}</div>}
                              </div>
                            )}
                          </div>
                        )}

                        {isExpanded && (
                          <div className="space-y-2 text-[11px] text-gray-600">
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                Assigned: {ticket.assignedTo}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                Opened: {ticket.openDate}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                ETA: {ticket.expectedCompletion}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {ticket.timeline.map((stage, index) => (
                                <span
                                  key={`${ticket.id}-${index}`}
                                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600"
                                >
                                  {stage}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="self-start w-full">
        <AssistantsPanel showGuides runbookTickets={resolutionTicketsForAmelia}/>
      </div>
    </div>
  )
}

export default function App(){
  const user = {
    name: "Anuj Gupta",
    email: "anuj@org.com",
    team: "IT Operations",
    doj: "2024-08-01"
  }

  const [activePersona, setActivePersona] = useState('endUser')

  const personaTabs = [
    { key: 'endUser', label: 'End User Persona' },
    { key: 'agent', label: 'Agent Persona' }
  ]

  const endUserLinks = [
    { label: 'Payroll', icon: Wallet, href: '#', description: 'Review pay statements, tax forms, and direct deposit details.' },
    { label: 'Timesheet', icon: ClipboardList, href: '#', description: 'Submit and approve weekly timesheets for your team.' },
    { label: 'PTO Requests', icon: Plane, href: '#', description: 'Request vacation, track balances, and view approvals.' },
    { label: 'Holiday Calendar', icon: CalendarDays, href: '#', description: 'Check upcoming company holidays and office closures.' }
  ]

  const agentLinks = [
    { label: 'Case Queue', icon: Ticket, href: '#' },
    { label: 'Runbook Library', icon: BookOpen, href: '#' },
    { label: 'Knowledge Console', icon: FileText, href: '#' },
    { label: 'Live Monitoring', icon: Laptop, href: '#' }
  ]

  const tenure = { years: 0, months: 0, days: 80 }
  const tenureLabel = `${tenure.years}y ${tenure.months}m ${tenure.days}d`

  const shortcutsTitle = activePersona === 'endUser' ? 'Daily Portals' : 'Agent Shortcuts'
  const shortcutsLinks = activePersona === 'endUser' ? endUserLinks : agentLinks

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 px-6 py-12 flex flex-col items-center gap-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm inline-flex gap-2">
          {personaTabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActivePersona(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activePersona === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <UserCircle2 className="w-10 h-10 text-gray-600"/>
              <div>
                <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-500">Team: {user.team}</div>
                <div className="text-xs text-gray-500">DOJ: {user.doj} · Tenure: {tenureLabel}</div>
              </div>
            </div>
            <Button variant="outline" className="gap-2 border-slate-300"><Settings className="w-4 h-4"/>Settings</Button>
          </div>
          <div className="px-6 pb-6 space-y-4 bg-slate-50/50">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">{shortcutsTitle}</div>
              <div className="flex flex-wrap gap-2">
                {shortcutsLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <div key={link.label} className="relative group">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-slate-200 bg-white hover:bg-blue-50 text-gray-700 gap-2"
                      >
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          <Icon className="w-4 h-4"/>
                          {link.label}
                        </a>
                      </Button>
                      {link.description && (
                        <div className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-52 -translate-x-1/2 translate-y-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-lg group-hover:flex group-focus-within:flex">
                          {link.description}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {activePersona === 'endUser' ? <EndUserPortal /> : <AgentPortal />}
          </div>
        </div>
      </div>
    </div>
  )
}
