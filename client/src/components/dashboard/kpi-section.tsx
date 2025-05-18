import React from 'react';
import { KpiCard } from './kpi-card';
import { DashboardKpi, OrganizationSettings } from '@shared/schema';

interface KpiSectionProps {
  kpiData?: DashboardKpi;
  planData?: OrganizationSettings;
}

export function KpiSection({ kpiData, planData }: KpiSectionProps) {
  const messagesRemaining = planData ? planData.planMessagesLimit - planData.planMessagesUsed : 0;
  const messagesTotal = planData ? planData.planMessagesLimit : 0;
  const messagesPercentage = messagesTotal > 0 ? (messagesRemaining / messagesTotal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Messages Remaining */}
      <KpiCard
        title="Mensagens restantes"
        value={`${messagesRemaining}/${messagesTotal}`}
        icon="email"
        iconBgColor="bg-primary-50"
        iconColor="text-primary-500"
        progressValue={messagesPercentage}
        progressColor="bg-primary-500"
        tag={{
          text: `Plano ${planData?.planType || 'Premium'}`,
          bgColor: "bg-primary-50",
          textColor: "text-primary-600"
        }}
      />

      {/* Read Rate */}
      <KpiCard
        title="Taxa de leitura"
        value={`${kpiData?.readRate.toFixed(1) || 0}%`}
        icon="visibility"
        iconBgColor="bg-success-50"
        iconColor="text-success-500"
        progressValue={kpiData?.readRate || 0}
        progressColor="bg-success-500"
        trend={{
          value: `${Math.abs(kpiData?.readRateChange || 0).toFixed(1)}% esta semana`,
          isPositive: (kpiData?.readRateChange || 0) >= 0
        }}
      />

      {/* Adoption Rate */}
      <KpiCard
        title="Taxa de Adesão"
        value={`${kpiData?.adoptionRate.toFixed(1) || 0}%`}
        icon="groups"
        iconBgColor="bg-secondary-50"
        iconColor="text-secondary-500"
        progressValue={kpiData?.adoptionRate || 0}
        progressColor="bg-secondary-500"
        trend={{
          value: `${Math.abs(kpiData?.adoptionRateChange || 0).toFixed(1)}% esta semana`,
          isPositive: (kpiData?.adoptionRateChange || 0) >= 0
        }}
      >
        <div className="text-sm text-neutral-500 mt-1">
          {kpiData?.adoptionRegistered || 0}/{kpiData?.adoptionTotal || 0} alunos
        </div>
      </KpiCard>

      {/* CSAT Score */}
      <KpiCard
        title="Pontuação CSAT"
        value={`${kpiData?.csatScore.toFixed(1) || 0}/5`}
        icon="stars"
        iconBgColor="bg-primary-50"
        iconColor="text-primary-500"
        progressValue={(kpiData?.csatScore || 0) * 20} // Convert 0-5 to 0-100
        progressColor="bg-primary-500"
        trend={{
          value: `${Math.abs(kpiData?.csatScoreChange || 0).toFixed(1)} este mês`,
          isPositive: (kpiData?.csatScoreChange || 0) >= 0
        }}
      />
    </div>
  );
}
