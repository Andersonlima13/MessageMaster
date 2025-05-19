import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactApexChart from 'react-apexcharts';
import { nanoid } from 'nanoid';

interface AIAnalyticsProps {
  studentData?: any[];
}

// Componente de análise de desempenho com IA
export function AIAnalytics({ studentData = [] }: AIAnalyticsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dados simulados para análise de desempenho
  const mockStudentData = [
    { id: 1, name: 'Ana Silva', avg: 8.7, attendance: 96, improvement: 12, engagementScore: 9.2 },
    { id: 2, name: 'Bruno Costa', avg: 7.3, attendance: 88, improvement: 5, engagementScore: 7.8 },
    { id: 3, name: 'Carla Oliveira', avg: 9.2, attendance: 98, improvement: 8, engagementScore: 9.5 },
    { id: 4, name: 'Diego Santos', avg: 6.5, attendance: 79, improvement: -2, engagementScore: 6.2 },
    { id: 5, name: 'Elena Pereira', avg: 8.9, attendance: 92, improvement: 15, engagementScore: 8.7 },
    { id: 6, name: 'Fábio Rodrigues', avg: 7.8, attendance: 85, improvement: 7, engagementScore: 7.4 },
    { id: 7, name: 'Gabriela Lima', avg: 9.5, attendance: 97, improvement: 10, engagementScore: 9.6 },
    { id: 8, name: 'Henrique Alves', avg: 6.8, attendance: 76, improvement: 3, engagementScore: 6.5 },
  ];

  const data = studentData.length > 0 ? studentData : mockStudentData;
  
  // Análise simulada usando algoritmos preditivos
  useEffect(() => {
    setLoading(true);
    
    // Simulação de processamento de IA
    setTimeout(() => {
      // Análise de correlação entre frequência e desempenho
      const attendanceAvgCorrelation = calculateCorrelation(
        data.map(s => s.attendance),
        data.map(s => s.avg)
      );
      
      // Análise de melhoria de desempenho
      const avgImprovement = data.reduce((sum, s) => sum + s.improvement, 0) / data.length;
      
      // Identificação de estudantes em risco
      const atRiskStudents = data.filter(s => s.avg < 7.0 && s.attendance < 80).length;
      
      // Análise de engajamento
      const highEngagement = data.filter(s => s.engagementScore > 8.5).length;
      const percentHighEngagement = Math.round((highEngagement / data.length) * 100);
      
      // Gerar insights baseados nas análises
      const newInsights = [
        `Correlação entre frequência e média: ${Math.abs(attendanceAvgCorrelation) > 0.7 ? 'Alta' : 'Moderada'} (${attendanceAvgCorrelation.toFixed(2)})`,
        `Média de melhoria no desempenho: ${avgImprovement.toFixed(1)} pontos`,
        `${atRiskStudents} alunos identificados com risco de reprovação`,
        `${percentHighEngagement}% dos alunos demonstram alto engajamento nas atividades`,
        `Análise preditiva sugere foco em monitoramento de alunos com frequência abaixo de 80%`,
        `Recomendação: criar grupos de estudo com alunos de alto e baixo desempenho`,
      ];
      
      setInsights(newInsights);
      setLoading(false);
    }, 1500);
  }, [data]);

  // Série temporal de desempenho (simulada)
  const performanceTrend = {
    series: [{
      name: 'Média da turma',
      data: [7.2, 7.4, 7.3, 7.6, 7.9, 8.2, 8.3, 8.5]
    }, {
      name: 'Frequência média (%)',
      data: [85, 84, 86, 88, 90, 89, 92, 94].map(v => v / 10) // Escala para caber no gráfico
    }],
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif',
      },
      colors: ['#7c3aed', '#111111'],
      stroke: {
        width: 4,
        curve: 'straight'
      },
      xaxis: {
        categories: ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'],
        labels: {
          style: {
            fontWeight: 600,
          }
        }
      },
      yaxis: [
        {
          title: {
            text: 'Média da turma',
            style: {
              fontWeight: 700,
            }
          },
          min: 5,
          max: 10,
        },
        {
          opposite: true,
          title: {
            text: 'Frequência (%)',
            style: {
              fontWeight: 700,
            }
          },
          min: 5,
          max: 10,
          labels: {
            formatter: function(val: number) {
              return (val * 10).toFixed(0) + '%';
            }
          }
        }
      ],
      legend: {
        position: 'top',
        fontWeight: 700,
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
      },
      tooltip: {
        y: [
          {
            formatter: function(val: number) {
              return val.toFixed(1);
            }
          },
          {
            formatter: function(val: number) {
              return (val * 10).toFixed(0) + '%';
            }
          }
        ]
      }
    },
  };

  // Categorias de desempenho
  const performanceDistribution = {
    series: [
      Math.round(data.filter(s => s.avg >= 9.0).length / data.length * 100),
      Math.round(data.filter(s => s.avg >= 7.0 && s.avg < 9.0).length / data.length * 100),
      Math.round(data.filter(s => s.avg >= 5.0 && s.avg < 7.0).length / data.length * 100),
      Math.round(data.filter(s => s.avg < 5.0).length / data.length * 100),
    ],
    options: {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
      },
      colors: ['#7c3aed', '#a78bfa', '#38bdf8', '#f87171'],
      labels: ['Excelente (9-10)', 'Bom (7-8.9)', 'Regular (5-6.9)', 'Insuficiente (<5)'],
      legend: {
        position: 'bottom',
        fontWeight: 600,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            labels: {
              show: true,
              name: {
                show: true,
                fontWeight: 700,
              },
              value: {
                show: true,
                fontWeight: 700,
                formatter: function (val: string) {
                  return val + '%';
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontWeight: 700,
                formatter: function (w: any) {
                  return '100%';
                }
              }
            }
          }
        }
      }
    },
  };

  // Engajamento por tipo de atividade
  const engagementByActivity = {
    series: [{
      data: [92, 85, 78, 96, 88]
    }],
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        fontFamily: 'Inter, sans-serif',
      },
      colors: ['#7c3aed'],
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: '70%',
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val + '%';
        },
        style: {
          fontWeight: 700,
        }
      },
      xaxis: {
        categories: ['Vídeos', 'Questionários', 'Leitura', 'Projetos', 'Debates'],
        labels: {
          style: {
            fontWeight: 600,
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          style: {
            fontWeight: 600,
          }
        }
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card className="brutalist-card">
        <CardHeader className="brutalist-gradient">
          <CardTitle className="brutalist-title text-center">ANÁLISE DE DESEMPENHO IA</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="brutalist-subtitle">INSIGHTS AUTOMÁTICOS</h3>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-7 bg-purple-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {insights.map((insight) => (
                    <li key={nanoid()} className="brutalist-monospace">{insight}</li>
                  ))}
                </ul>
              )}
              
              <div className="pt-4">
                <h3 className="brutalist-subtitle mb-4">DISTRIBUIÇÃO DE NOTAS</h3>
                <ReactApexChart 
                  options={performanceDistribution.options as any}
                  series={performanceDistribution.series}
                  type="donut"
                  height={320}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="brutalist-subtitle mb-4">TENDÊNCIA DE DESEMPENHO</h3>
              <ReactApexChart 
                options={performanceTrend.options as any}
                series={performanceTrend.series}
                type="line"
                height={320}
              />
              
              <h3 className="brutalist-subtitle mt-4">ENGAJAMENTO POR ATIVIDADE</h3>
              <ReactApexChart 
                options={engagementByActivity.options as any}
                series={engagementByActivity.series}
                type="bar"
                height={320}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Função auxiliar para calcular correlação entre dois conjuntos de dados
function calculateCorrelation(x: number[], y: number[]) {
  const n = x.length;
  
  // Médias
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Covariância e variâncias
  let cov = 0;
  let xVar = 0;
  let yVar = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    cov += xDiff * yDiff;
    xVar += xDiff * xDiff;
    yVar += yDiff * yDiff;
  }
  
  // Coeficiente de correlação de Pearson
  return cov / Math.sqrt(xVar * yVar);
}