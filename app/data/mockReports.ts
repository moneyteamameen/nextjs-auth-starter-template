import { TableOfContentsItem } from '../components/reports/ReportTableOfContents';

export interface Report {
  id: string;
  title: string;
  description: string;
  project: string;
  author: string;
  createdAt: Date;
  sections: ReportSection[];
  tableOfContents: TableOfContentsItem[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  level: number;
  children?: ReportSection[];
}

export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Structural Analysis Report - Riverside Office Tower',
    description: 'Comprehensive analysis of structural integrity and compliance with building codes.',
    project: 'Riverside Office Tower',
    author: 'John Smith',
    createdAt: new Date(2023, 5, 15),
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1,
        content: `
          <p>This structural analysis report provides a comprehensive evaluation of the Riverside Office Tower project. The assessment confirms that the design meets all required building codes and standards with several recommendations for optimizations.</p>
          <p>The structure demonstrates excellent load-bearing capacity and is expected to perform well against lateral forces. Wind load analysis shows adequate performance within safety parameters, and seismic analysis indicates compliance with local requirements.</p>
          <p>Key recommendations include additional reinforcement in specific column joints on lower floors and minor modifications to the beam connections on floors 8-10.</p>
        `
      },
      {
        id: 'introduction',
        title: 'Introduction',
        level: 1,
        content: `
          <p>The Riverside Office Tower is a 12-story commercial building located in downtown riverside district. This report presents the results of a thorough structural analysis performed to evaluate the design's compliance with local building codes and industry standards.</p>
          <p>The analysis covers gravity loads, lateral forces, wind loads, and seismic considerations. It also evaluates the foundation design and structural connections throughout the building.</p>
        `
      },
      {
        id: 'methodology',
        title: 'Methodology',
        level: 1,
        content: `
          <p>The structural analysis was conducted using state-of-the-art computational modeling and simulation tools, following the guidelines established by the International Building Code (IBC) and local amendments.</p>
        `,
        children: [
          {
            id: 'analysis-tools',
            title: 'Analysis Tools',
            level: 2,
            content: `
              <p>The following tools were utilized for this analysis:</p>
              <ul>
                <li>ETABS for 3D structural modeling and analysis</li>
                <li>SAFE for foundation design analysis</li>
                <li>Custom in-house software for connection design verification</li>
                <li>RISA-3D for cross-validation of critical elements</li>
              </ul>
            `
          },
          {
            id: 'load-cases',
            title: 'Load Cases',
            level: 2,
            content: `
              <p>Multiple load combinations were analyzed in accordance with ASCE 7-16, including:</p>
              <ul>
                <li>Dead loads</li>
                <li>Live loads (office occupancy)</li>
                <li>Wind loads (90 mph design wind speed)</li>
                <li>Seismic loads (Site Class D)</li>
                <li>Combined load cases per code requirements</li>
              </ul>
            `
          }
        ]
      },
      {
        id: 'findings',
        title: 'Findings',
        level: 1,
        content: `
          <p>The structural analysis yielded the following key findings:</p>
        `,
        children: [
          {
            id: 'gravity-system',
            title: 'Gravity System',
            level: 2,
            content: `
              <p>The gravity load-bearing system shows adequate performance under all considered loading scenarios. Floor systems demonstrate sufficient stiffness with maximum deflections within acceptable limits. Column loads are well-distributed with utilization ratios not exceeding 85% under worst-case scenarios.</p>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium mb-2">Key Metrics:</h4>
                <ul>
                  <li>Maximum column axial load: 1240 kips</li>
                  <li>Maximum floor beam deflection: L/480</li>
                  <li>Typical floor vibration frequency: 5.8 Hz</li>
                </ul>
              </div>
            `,
            children: [
              {
                id: 'columns',
                title: 'Columns',
                level: 3,
                content: `
                  <p>Column design is generally adequate with the following observations:</p>
                  <ul>
                    <li>Corner columns show higher utilization than anticipated</li>
                    <li>Interior columns have sufficient capacity</li>
                    <li>Column schedule follows optimal sizing progression</li>
                  </ul>
                  <div class="mt-4">
                    <img src="https://via.placeholder.com/600x300" alt="Column load diagram" class="rounded-lg border border-gray-200" />
                    <p class="text-sm text-gray-500 mt-1">Figure 1: Column load distribution diagram</p>
                  </div>
                `
              },
              {
                id: 'beams',
                title: 'Beams',
                level: 3,
                content: `
                  <p>Beam design meets all code requirements with the following notes:</p>
                  <ul>
                    <li>Typical bay beams perform with utilization ratios between 65-78%</li>
                    <li>Transfer beams at level 3 require special detailing</li>
                    <li>Composite action assumptions verified as valid</li>
                  </ul>
                `
              }
            ]
          },
          {
            id: 'lateral-system',
            title: 'Lateral System',
            level: 2,
            content: `
              <p>The lateral force resisting system consists of steel moment frames along the perimeter and braced frames in the core. This hybrid system performs well under both wind and seismic loading.</p>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium mb-2">Performance Metrics:</h4>
                <ul>
                  <li>Maximum story drift under wind: H/450</li>
                  <li>Maximum story drift under seismic: H/250</li>
                  <li>Fundamental period: 1.8 seconds</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        id: 'recommendations',
        title: 'Recommendations',
        level: 1,
        content: `
          <p>Based on the findings of this analysis, we recommend the following actions:</p>
          <ol>
            <li>Increase the size of corner columns at floors 1-3 to reduce utilization ratio to below 75%</li>
            <li>Enhance connection details at the transfer level to provide additional redundancy</li>
            <li>Consider adding supplementary damping devices to improve occupant comfort during wind events</li>
            <li>Review and potentially upgrade foundation elements at the northeast corner</li>
            <li>Implement the suggested connection modifications for the braced frames</li>
          </ol>
          <p>These recommendations are offered to enhance the overall performance and safety of the structure while potentially reducing construction costs through optimization.</p>
        `
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        level: 1,
        content: `
          <p>The Riverside Office Tower structural design generally meets or exceeds all applicable code requirements and industry standards. With the implementation of the recommended modifications, the structure will demonstrate excellent performance over its design life.</p>
          <p>The design team has done commendable work in balancing efficiency with safety and serviceability. This report confirms the structural viability of the project with minor modifications suggested for optimization.</p>
        `
      },
      {
        id: 'appendices',
        title: 'Appendices',
        level: 1,
        content: `
          <p>The following appendices contain detailed data and calculations supporting this report:</p>
          <ul>
            <li>Appendix A: Detailed Calculation Sheets</li>
            <li>Appendix B: Computer Model Results</li>
            <li>Appendix C: Material Specifications</li>
            <li>Appendix D: Connection Design Details</li>
            <li>Appendix E: Foundation Analysis</li>
          </ul>
        `
      }
    ],
    tableOfContents: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1
      },
      {
        id: 'introduction',
        title: 'Introduction',
        level: 1
      },
      {
        id: 'methodology',
        title: 'Methodology',
        level: 1,
        children: [
          {
            id: 'analysis-tools',
            title: 'Analysis Tools',
            level: 2
          },
          {
            id: 'load-cases',
            title: 'Load Cases',
            level: 2
          }
        ]
      },
      {
        id: 'findings',
        title: 'Findings',
        level: 1,
        children: [
          {
            id: 'gravity-system',
            title: 'Gravity System',
            level: 2,
            children: [
              {
                id: 'columns',
                title: 'Columns',
                level: 3
              },
              {
                id: 'beams',
                title: 'Beams',
                level: 3
              }
            ]
          },
          {
            id: 'lateral-system',
            title: 'Lateral System',
            level: 2
          }
        ]
      },
      {
        id: 'recommendations',
        title: 'Recommendations',
        level: 1
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        level: 1
      },
      {
        id: 'appendices',
        title: 'Appendices',
        level: 1
      }
    ]
  },
  {
    id: 'report-2',
    title: 'Foundation Analysis Report - Harbor View Hospital',
    description: 'Detailed assessment of foundation design and soil conditions.',
    project: 'Harbor View Hospital',
    author: 'Emma Johnson',
    createdAt: new Date(2023, 4, 22),
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1,
        content: `
          <p>This foundation analysis report provides a comprehensive evaluation of the Harbor View Hospital project's foundation design. The assessment confirms that the foundation design meets all geotechnical requirements with some recommendations for optimizations.</p>
        `
      }
    ],
    tableOfContents: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1
      }
    ]
  },
  {
    id: 'report-3',
    title: 'Material Compliance Report - Metro Station Renovation',
    description: 'Verification of materials against specifications and safety standards.',
    project: 'Metro Station Renovation',
    author: 'Alex Martinez',
    createdAt: new Date(2023, 3, 18),
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1,
        content: `
          <p>This material compliance report provides verification that all materials used in the Metro Station Renovation project meet or exceed specifications and applicable safety standards.</p>
        `
      }
    ],
    tableOfContents: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        level: 1
      }
    ]
  }
];

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

export const flattenSections = (sections: ReportSection[]): ReportSection[] => {
  let result: ReportSection[] = [];
  
  for (const section of sections) {
    result.push(section);
    if (section.children && section.children.length > 0) {
      result = [...result, ...flattenSections(section.children)];
    }
  }
  
  return result;
}; 