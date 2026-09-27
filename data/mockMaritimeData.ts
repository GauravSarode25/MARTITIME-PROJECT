export interface VesselCandidate {
  id: string;
  name: string;
  mmsi: string;
  imo: string;
  flag: string;
  flagCode: string;
  type: 'VLCC Crude Tanker' | 'Chemical Tanker' | 'Container Ship' | 'Bulk Carrier' | 'LNG Tanker' | 'Fishing Vessel';
  lengthBeam: string;
  speed: number; // knots
  heading: number; // degrees
  riskScore: number; // 0-100
  riskCategory: 'CRITICAL' | 'MODERATE' | 'LOW';
  distanceToDischarge: string; // e.g. "0.8 NM"
  driftOverlapScore: number; // percentage
  aisGapDuration: string; // e.g. "3h 42m"
  hasAisGap: boolean;
  lastKnownPos: [number, number]; // lat, lng
  dischargePosEstimate: [number, number]; // lat, lng
  trajectoryPoints: Array<[number, number]>;
  inferredPoints: Array<[number, number]>;
}

export interface SlickIncident {
  id: string;
  title: string;
  region: string;
  acquisitionUtc: string;
  sensor: string;
  polarization: string;
  resolution: string;
  slickAreaKm2: number;
  estOilVolumeM3: number;
  estBarrels: number;
  darkSpotContrastDb: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  currentKnots: number;
  currentDirectionDeg: number;
  centerCoordinates: [number, number]; // lat, lng
  bounds: Array<[number, number]>;
  polygonCoordinates: Array<[number, number]>;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  marpolAnnex: 'Annex I (Oil)' | 'Annex II (Noxious Liquid)' | 'Unverified Bilge Discharge';
  candidates: VesselCandidate[];
  evidenceTimeline: Array<{
    id: string;
    timestampUtc: string;
    title: string;
    description: string;
    type: 'EMPIRICAL' | 'INFERRED' | 'ALERT' | 'CONFIRMATION';
    vesselId?: string;
    coordinates?: [number, number];
  }>;
  driftReplaySteps: Array<{
    hoursAgo: number; // 0, 2, 4, 6, 8, 10, 12
    timestampUtc: string;
    center: [number, number];
    slickSpreadKm2: number;
    windVector: { speed: number; dir: number };
    currentVector: { speed: number; dir: number };
  }>;
}

export interface CorridorStat {
  id: string;
  name: string;
  coordinates: [number, number];
  incidentCount: number;
  highConfidenceCount: number;
  riskLevel: 'HIGH' | 'ELEVATED' | 'MODERATE';
  primaryVesselTypes: string[];
  recurrentOffenderMmsi: string[];
}

export interface RecurrentOffender {
  mmsi: string;
  name: string;
  flag: string;
  type: string;
  incidentsCount: number;
  lastIncidentDate: string;
  marpolViolationStatus: 'FLAGGED FOR PORT STATE CONTROL' | 'INVESTIGATION PENDING' | 'MONITORED';
}

export const MOCK_SLICK_INCIDENTS: SlickIncident[] = [
  {
    id: 'INC-2026-0917-MALACCA-01',
    title: 'Strait of Malacca North-Bound Slick Detection',
    region: 'Malacca Strait (Sector 4)',
    acquisitionUtc: '2026-09-17 04:12:18 UTC',
    sensor: 'Sentinel-1A C-band SAR',
    polarization: 'VV + VH',
    resolution: '10m x 10m Ground Square',
    slickAreaKm2: 14.8,
    estOilVolumeM3: 48.5,
    estBarrels: 305,
    darkSpotContrastDb: -8.4,
    windSpeedKnots: 8.2,
    windDirectionDeg: 210,
    currentKnots: 1.4,
    currentDirectionDeg: 345,
    centerCoordinates: [2.845, 101.42],
    bounds: [
      [2.82, 101.39],
      [2.87, 101.45]
    ],
    polygonCoordinates: [
      [2.855, 101.405],
      [2.862, 101.422],
      [2.858, 101.442],
      [2.842, 101.448],
      [2.831, 101.435],
      [2.828, 101.412],
      [2.840, 101.398],
      [2.855, 101.405]
    ],
    confidence: 'HIGH',
    marpolAnnex: 'Annex I (Oil)',
    candidates: [
      {
        id: 'VES-8849201',
        name: 'M/T OCEANIC LEGACY',
        mmsi: '352988102',
        imo: '9842109',
        flag: 'Panama',
        flagCode: 'PA',
        type: 'VLCC Crude Tanker',
        lengthBeam: '333m x 60m',
        speed: 13.8,
        heading: 325,
        riskScore: 94.2,
        riskCategory: 'CRITICAL',
        distanceToDischarge: '0.4 NM',
        driftOverlapScore: 98.4,
        aisGapDuration: '3h 42m',
        hasAisGap: true,
        lastKnownPos: [2.882, 101.398],
        dischargePosEstimate: [2.832, 101.428],
        trajectoryPoints: [
          [2.65, 101.55],
          [2.72, 101.50],
          [2.79, 101.45],
          [2.832, 101.428], // Discharge point
          [2.882, 101.398]
        ],
        inferredPoints: [
          [2.79, 101.45],
          [2.805, 101.442],
          [2.820, 101.434],
          [2.832, 101.428]
        ]
      },
      {
        id: 'VES-9210492',
        name: 'M/V NORDIC HORIZON',
        mmsi: '636019241',
        imo: '9710332',
        flag: 'Liberia',
        flagCode: 'LR',
        type: 'Chemical Tanker',
        lengthBeam: '183m x 32m',
        speed: 11.2,
        heading: 320,
        riskScore: 68.5,
        riskCategory: 'MODERATE',
        distanceToDischarge: '2.1 NM',
        driftOverlapScore: 71.2,
        aisGapDuration: '0h 15m',
        hasAisGap: false,
        lastKnownPos: [2.895, 101.440],
        dischargePosEstimate: [2.840, 101.465],
        trajectoryPoints: [
          [2.68, 101.58],
          [2.75, 101.52],
          [2.840, 101.465],
          [2.895, 101.440]
        ],
        inferredPoints: []
      },
      {
        id: 'VES-7740192',
        name: 'S/R STRAIT EXPRESS',
        mmsi: '563044120',
        imo: '9542011',
        flag: 'Singapore',
        flagCode: 'SG',
        type: 'Container Ship',
        lengthBeam: '366m x 51m',
        speed: 18.5,
        heading: 328,
        riskScore: 18.4,
        riskCategory: 'LOW',
        distanceToDischarge: '6.8 NM',
        driftOverlapScore: 14.0,
        aisGapDuration: 'None',
        hasAisGap: false,
        lastKnownPos: [2.940, 101.350],
        dischargePosEstimate: [2.870, 101.400],
        trajectoryPoints: [
          [2.60, 101.52],
          [2.75, 101.44],
          [2.940, 101.350]
        ],
        inferredPoints: []
      }
    ],
    evidenceTimeline: [
      {
        id: 'EV-01',
        timestampUtc: '2026-09-17 00:30:00 UTC',
        title: 'AIS Transponder Deactivated (M/T OCEANIC LEGACY)',
        description: 'Vessel AIS Class-A transponder ceased telemetry transmission 18.4 NM southeast of current slick centroid.',
        type: 'ALERT',
        vesselId: 'VES-8849201',
        coordinates: [2.79, 101.45]
      },
      {
        id: 'EV-02',
        timestampUtc: '2026-09-17 02:15:00 UTC',
        title: 'Estimated Hydrodynamic Discharge Window (T-2h)',
        description: 'Backward Lagrangian drift reconstruction pinpoints highest probability discharge overlap with vessel inferred course.',
        type: 'INFERRED',
        vesselId: 'VES-8849201',
        coordinates: [2.832, 101.428]
      },
      {
        id: 'EV-03',
        timestampUtc: '2026-09-17 04:12:18 UTC',
        title: 'SAR Satellite Pass Acquisition (Sentinel-1A)',
        description: 'Synthetic Aperture Radar VV polarimetric scene acquired with -8.4 dB dark spot backscatter anomaly over 14.8 km² surface area.',
        type: 'EMPIRICAL',
        coordinates: [2.845, 101.42]
      },
      {
        id: 'EV-04',
        timestampUtc: '2026-09-17 04:12:20 UTC',
        title: 'AIS Telemetry Resumed (M/T OCEANIC LEGACY)',
        description: 'Transponder reactivated reporting 13.8 knots course 325°. Distance to slick trail edge: 0.4 NM.',
        type: 'EMPIRICAL',
        vesselId: 'VES-8849201',
        coordinates: [2.882, 101.398]
      }
    ],
    driftReplaySteps: [
      {
        hoursAgo: 0,
        timestampUtc: '04:12 UTC (T-0)',
        center: [2.845, 101.42],
        slickSpreadKm2: 14.8,
        windVector: { speed: 8.2, dir: 210 },
        currentVector: { speed: 1.4, dir: 345 }
      },
      {
        hoursAgo: 2,
        timestampUtc: '02:12 UTC (T-2h)',
        center: [2.832, 101.428],
        slickSpreadKm2: 11.2,
        windVector: { speed: 7.9, dir: 205 },
        currentVector: { speed: 1.5, dir: 340 }
      },
      {
        hoursAgo: 4,
        timestampUtc: '00:12 UTC (T-4h)',
        center: [2.818, 101.438],
        slickSpreadKm2: 7.8,
        windVector: { speed: 8.5, dir: 215 },
        currentVector: { speed: 1.3, dir: 350 }
      },
      {
        hoursAgo: 6,
        timestampUtc: '22:12 UTC (T-6h)',
        center: [2.802, 101.448],
        slickSpreadKm2: 4.5,
        windVector: { speed: 9.0, dir: 220 },
        currentVector: { speed: 1.2, dir: 355 }
      },
      {
        hoursAgo: 8,
        timestampUtc: '20:12 UTC (T-8h)',
        center: [2.788, 101.458],
        slickSpreadKm2: 2.1,
        windVector: { speed: 8.8, dir: 210 },
        currentVector: { speed: 1.4, dir: 345 }
      }
    ]
  },
  {
    id: 'INC-2026-0916-NORTHSEA-04',
    title: 'North Sea Oil Platform Perimeter Discharge',
    region: 'North Sea (Sector 12B)',
    acquisitionUtc: '2026-09-16 18:45:00 UTC',
    sensor: 'RADARSAT Constellation Mission',
    polarization: 'HH + HV',
    resolution: '5m x 5m Fine Quad',
    slickAreaKm2: 8.4,
    estOilVolumeM3: 22.1,
    estBarrels: 139,
    darkSpotContrastDb: -10.2,
    windSpeedKnots: 16.4,
    windDirectionDeg: 140,
    currentKnots: 2.1,
    currentDirectionDeg: 60,
    centerCoordinates: [56.45, 3.22],
    bounds: [
      [56.43, 3.19],
      [56.48, 3.25]
    ],
    polygonCoordinates: [
      [56.465, 3.205],
      [56.475, 3.225],
      [56.460, 3.245],
      [56.442, 3.238],
      [56.435, 3.212],
      [56.450, 3.198],
      [56.465, 3.205]
    ],
    confidence: 'HIGH',
    marpolAnnex: 'Annex I (Oil)',
    candidates: [
      {
        id: 'VES-4412091',
        name: 'M/T NORTHERN COMMANDER',
        mmsi: '235099211',
        imo: '9641029',
        flag: 'United Kingdom',
        flagCode: 'GB',
        type: 'Chemical Tanker',
        lengthBeam: '144m x 23m',
        speed: 10.4,
        heading: 45,
        riskScore: 88.9,
        riskCategory: 'CRITICAL',
        distanceToDischarge: '0.9 NM',
        driftOverlapScore: 92.1,
        aisGapDuration: '1h 10m',
        hasAisGap: true,
        lastKnownPos: [56.48, 3.24],
        dischargePosEstimate: [56.44, 3.21],
        trajectoryPoints: [
          [56.35, 3.10],
          [56.40, 3.16],
          [56.44, 3.21],
          [56.48, 3.24]
        ],
        inferredPoints: [
          [56.40, 3.16],
          [56.42, 3.18],
          [56.44, 3.21]
        ]
      }
    ],
    evidenceTimeline: [
      {
        id: 'EV-NS-01',
        timestampUtc: '2026-09-16 16:30:00 UTC',
        title: 'AIS Transponder Gap Detected',
        description: 'M/T NORTHERN COMMANDER gap of 70 min during north-east transit.',
        type: 'ALERT',
        vesselId: 'VES-4412091',
        coordinates: [56.40, 3.16]
      },
      {
        id: 'EV-NS-02',
        timestampUtc: '2026-09-16 18:45:00 UTC',
        title: 'RADARSAT Scan Verification',
        description: 'High resolution 5m SAR imagery confirms 8.4 km² slick.',
        type: 'EMPIRICAL',
        coordinates: [56.45, 3.22]
      }
    ],
    driftReplaySteps: [
      {
        hoursAgo: 0,
        timestampUtc: '18:45 UTC (T-0)',
        center: [56.45, 3.22],
        slickSpreadKm2: 8.4,
        windVector: { speed: 16.4, dir: 140 },
        currentVector: { speed: 2.1, dir: 60 }
      },
      {
        hoursAgo: 2,
        timestampUtc: '16:45 UTC (T-2h)',
        center: [56.43, 3.20],
        slickSpreadKm2: 5.1,
        windVector: { speed: 15.8, dir: 145 },
        currentVector: { speed: 2.0, dir: 55 }
      }
    ]
  }
];

export const CORRIDOR_STATS: CorridorStat[] = [
  {
    id: 'CORR-01',
    name: 'Malacca Strait Main Shipping Lane',
    coordinates: [2.8, 101.4],
    incidentCount: 142,
    highConfidenceCount: 38,
    riskLevel: 'HIGH',
    primaryVesselTypes: ['VLCC Tanker', 'Chemical Tanker', 'Container Ship'],
    recurrentOffenderMmsi: ['352988102', '636019241', '371029118']
  },
  {
    id: 'CORR-02',
    name: 'Singapore Strait East Outer Anchorage',
    coordinates: [1.25, 104.2],
    incidentCount: 98,
    highConfidenceCount: 26,
    riskLevel: 'HIGH',
    primaryVesselTypes: ['VLCC Tanker', 'Bulk Carrier'],
    recurrentOffenderMmsi: ['563044120', '477109200']
  },
  {
    id: 'CORR-03',
    name: 'Dover Strait South Channel',
    coordinates: [50.9, 1.4],
    incidentCount: 64,
    highConfidenceCount: 14,
    riskLevel: 'ELEVATED',
    primaryVesselTypes: ['Container Ship', 'Ro-Ro Cargo'],
    recurrentOffenderMmsi: ['235099211']
  },
  {
    id: 'CORR-04',
    name: 'Strait of Hormuz Tanker Transit Route',
    coordinates: [26.5, 56.4],
    incidentCount: 115,
    highConfidenceCount: 42,
    riskLevel: 'HIGH',
    primaryVesselTypes: ['VLCC Tanker', 'LNG Tanker'],
    recurrentOffenderMmsi: ['408102990', '352988102']
  }
];

export const RECURRENT_OFFENDERS: RecurrentOffender[] = [
  {
    mmsi: '352988102',
    name: 'M/T OCEANIC LEGACY',
    flag: 'Panama (PA)',
    type: 'VLCC Crude Tanker',
    incidentsCount: 4,
    lastIncidentDate: '2026-09-17',
    marpolViolationStatus: 'FLAGGED FOR PORT STATE CONTROL'
  },
  {
    mmsi: '636019241',
    name: 'M/V NORDIC HORIZON',
    flag: 'Liberia (LR)',
    type: 'Chemical Tanker',
    incidentsCount: 3,
    lastIncidentDate: '2026-09-11',
    marpolViolationStatus: 'INVESTIGATION PENDING'
  },
  {
    mmsi: '235099211',
    name: 'M/T NORTHERN COMMANDER',
    flag: 'United Kingdom (GB)',
    type: 'Chemical Tanker',
    incidentsCount: 2,
    lastIncidentDate: '2026-09-16',
    marpolViolationStatus: 'FLAGGED FOR PORT STATE CONTROL'
  },
  {
    mmsi: '408102990',
    name: 'M/T PERSIAN STAR',
    flag: 'Bahamas (BS)',
    type: 'VLCC Crude Tanker',
    incidentsCount: 3,
    lastIncidentDate: '2026-08-29',
    marpolViolationStatus: 'MONITORED'
  }
];

export const SAMPLE_SAR_SCENES = [
  {
    id: 'S1A_IW_GRDH_1SDV_20260917T041218_MALACCA.SAFE',
    name: 'Sentinel-1A SAR Scene - Malacca Strait Sector 4',
    date: '2026-09-17 04:12:18 UTC',
    area: '14.8 km²',
    location: '2.845°N, 101.420°E',
    darkContrast: '-8.4 dB',
    status: 'Raw SAR Processing Ready'
  },
  {
    id: 'RCM_5M_FQ_20260916T184500_NORTHSEA.SAFE',
    name: 'RADARSAT Constellation - North Sea Sector 12B',
    date: '2026-09-16 18:45:00 UTC',
    area: '8.4 km²',
    location: '56.450°N, 3.220°E',
    darkContrast: '-10.2 dB',
    status: 'Raw SAR Processing Ready'
  },
  {
    id: 'S1B_IW_GRDH_20260914T112000_HORMUZ.SAFE',
    name: 'Sentinel-1B SAR Scene - Strait of Hormuz East',
    date: '2026-09-14 11:20:00 UTC',
    area: '22.1 km²',
    location: '26.500°N, 56.400°E',
    darkContrast: '-9.1 dB',
    status: 'Raw SAR Processing Ready'
  }
];
