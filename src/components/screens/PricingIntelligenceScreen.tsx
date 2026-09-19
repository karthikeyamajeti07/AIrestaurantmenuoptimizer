import React, { useState } from 'react';
import { Menu, PricingOpportunity, ScreenId } from '../../types';
import { NumberCounter } from '../common/NumberCounter';
import { Badge } from '../common/Badge';
import { menuService } from '../../services/mockMenuService';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Tag,
  Package,
  Anchor,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface PricingIntelligenceScreenProps {
  menu: Menu;
  recommendations: PricingOpportunity[];
  onApplyPricing: (dishId: string, suggestedPrice: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const PricingIntelligenceScreen: React.FC<PricingIntelligenceScreenProps> = ({
  menu,
  recommendations,
  onApplyPricing,
  onNavigate,
}) => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'anchors' | 'bundles'>('all');

  const handleApply = async (dishId: string, suggestedPrice: number) => {
    await menuService.applyPricingRecommendation(dishId, suggestedPrice);
    onApplyPricing(dishId, suggestedPrice);
    setAppliedIds((prev) => [...prev, dishId]);
  };

  // Prepare chart data: sorted by price
  const chartData = [...menu.dishes]
    .sort((a, b) => a.price - b.price)
    .map((dish) => {
      const rec = recommendations.find((r) => r.dishId === dish.id);
      return {
        name: dish.name.length > 14 ? dish.name.substring(0, 12) + '...' : dish.name,
        fullName: dish.name,
        currentPrice: dish.price,
        suggestedPrice: rec ? rec.suggestedPrice : dish.price,
        margin: dish.margin,
        isAnchor: dish.price >= 700,
      };
    });

  const filteredRecs = recommendations.filter((rec) => {
    if (activeTab === 'anchors') return rec.strategy === 'Price Anchor';
    if (activeTab === 'bundles') return rec.strategy === 'Bundle Opportunity';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
                Stage 04 • Quantitative Economics
              </span>
              <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
              <span className="text-xs text-[#736E64]">Algorithmic Elasticity Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1F22] font-bold tracking-tight">
              Pricing Intelligence & Optimization
            </h1>
            <p className="text-sm text-[#615B50] mt-1 max-w-2xl">
              Simulated price dispersion, psychological price tiering, and high-margin bundle opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('strategy')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1F2023] hover:bg-[#35363B] rounded transition-colors shadow-xs"
            >
              <span>Next: Menu Strategy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mandatory Advisory Disclaimer */}
        <div className="mt-5 p-3 rounded bg-[#F4EFE6] border border-[#DDD5C5] text-xs text-[#665F53] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#874A2B] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#2C2924] font-semibold">
              Advisory Recommendation Notice:
            </strong>{' '}
            The suggested prices and pairings are algorithmic optimization models derived from menu engineering matrices, decoy psychology, and restaurant food-cost spreads. These are strategic recommendations rather than guaranteed sales guarantees.
          </div>
        </div>

        {/* Pricing Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#ECE7DC]">
          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Average Menu Price</span>
            <span className="text-xl font-bold text-[#1E2022] mt-0.5 font-serif block">
              <NumberCounter value={menu.metadata.averagePrice} prefix="₹" />
            </span>
            <span className="text-[11px] text-[#555045]">Baseline ticket driver</span>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Lowest Price Item</span>
            <span className="text-xl font-bold text-[#1E2022] mt-0.5 font-serif block">
              <NumberCounter value={menu.metadata.lowestPrice} prefix="₹" />
            </span>
            <span className="text-[11px] text-[#555045]">Citrus Spritz & Limonata</span>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Highest Price Anchor</span>
            <span className="text-xl font-bold text-[#874A2B] mt-0.5 font-serif block">
              <NumberCounter value={menu.metadata.highestPrice} prefix="₹" />
            </span>
            <span className="text-[11px] text-[#874A2B]">Grilled Salmon</span>
          </div>

          <div className="p-3 bg-[#EBF3EC] rounded border border-[#CFE1D2]">
            <span className="text-[11px] text-[#235839] uppercase font-mono block font-medium">Est. Revenue Lift</span>
            <span className="text-xl font-bold text-[#1E5C38] mt-0.5 font-serif block">
              +<NumberCounter value={menu.metadata.potentialRevenueLift} suffix="%" decimals={1} />
            </span>
            <span className="text-[11px] text-[#235839]">Across dining tickets</span>
          </div>
        </div>
      </div>

      {/* Price Distribution Chart Card */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1C1D1F]">
              Menu Price Distribution (INR ₹)
            </h2>
            <p className="text-xs text-[#6B655C]">
              Ascending price distribution showing item spreads and anchor threshold (₹700+).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#555047]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#242629] inline-block" /> Current Price
            </span>
            <span className="flex items-center gap-1 text-[#874A2B]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#874A2B] inline-block" /> Price Anchor
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
              <XAxis
                dataKey="name"
                stroke="#8A8477"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#DDD6C9' }}
              />
              <YAxis
                stroke="#8A8477"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#DDD6C9' }}
                unit="₹"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #DDD5C5',
                  borderRadius: '4px',
                  fontSize: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
                formatter={(value: any, name: any, item: any) => [
                  `₹${value} (${item.payload.margin}% margin)`,
                  item.payload.fullName,
                ]}
              />
              <ReferenceLine
                y={menu.metadata.averagePrice}
                stroke="#948B7C"
                strokeDasharray="3 3"
                label={{
                  value: `Avg ₹${menu.metadata.averagePrice}`,
                  position: 'insideTopRight',
                  fill: '#696254',
                  fontSize: 10,
                }}
              />
              <Bar dataKey="currentPrice" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isAnchor ? '#874A2B' : '#2D2F33'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pricing Opportunities List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C1D1F]">
              Strategic Pricing Opportunities
            </h2>
            <p className="text-xs text-[#6B655C]">
              Heuristics generated to optimize contribution margin while preserving volume.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                activeTab === 'all'
                  ? 'bg-[#1F2022] text-[#FAF8F5]'
                  : 'bg-[#EFEAE0] text-[#555047] hover:bg-[#E5DFD3]'
              }`}
            >
              All ({recommendations.length})
            </button>
            <button
              onClick={() => setActiveTab('anchors')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                activeTab === 'anchors'
                  ? 'bg-[#1F2022] text-[#FAF8F5]'
                  : 'bg-[#EFEAE0] text-[#555047] hover:bg-[#E5DFD3]'
              }`}
            >
              Anchors
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                activeTab === 'bundles'
                  ? 'bg-[#1F2022] text-[#FAF8F5]'
                  : 'bg-[#EFEAE0] text-[#555047] hover:bg-[#E5DFD3]'
              }`}
            >
              Bundles
            </button>
          </div>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => {
            const isApplied = appliedIds.includes(rec.dishId);
            const isAnchor = rec.strategy === 'Price Anchor';
            const isBundle = rec.strategy === 'Bundle Opportunity';

            return (
              <div
                key={rec.dishId}
                className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-5 flex flex-col justify-between shadow-xs hover:border-[#D5CDBD] transition-colors"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold bg-[#EBE5D8] text-[#5E5749]">
                          {rec.strategy}
                        </span>
                        <Badge
                          variant={
                            rec.impactScore === 'High'
                              ? 'success'
                              : rec.impactScore === 'Medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {rec.impactScore} Impact
                        </Badge>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#1E2022]">
                        {rec.dishName}
                      </h3>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs text-[#736D61] line-through">
                        Current: ₹{rec.currentPrice}
                      </div>
                      <div className="text-base font-bold text-[#1C1D1F]">
                        Suggested: ₹{rec.suggestedPrice}
                      </div>
                    </div>
                  </div>

                  {/* Strategic Reasoning */}
                  <p className="text-xs text-[#524E44] leading-relaxed mt-2">
                    {rec.reasoning}
                  </p>

                  {/* Bundle Highlight if applicable */}
                  {rec.bundleDetails && (
                    <div className="mt-3 p-2.5 rounded bg-[#F2EDE2] border border-[#E0D7C6] text-xs text-[#4E493F] space-y-1">
                      <div className="font-semibold text-[#2C2924] flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-[#874A2B]" /> Combo Pairing Details:
                      </div>
                      <div>
                        Pair with: <strong>{rec.bundleDetails.pairedWith}</strong>
                      </div>
                      <div className="text-[11px] text-[#696357]">
                        {rec.bundleDetails.discountNotice}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#EAE4D8] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#787265]">
                    {isAnchor ? 'Anchor threshold' : isBundle ? 'Attachment strategy' : 'Price test'}
                  </span>

                  <button
                    onClick={() => handleApply(rec.dishId, rec.suggestedPrice)}
                    disabled={isApplied}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                      isApplied
                        ? 'bg-[#E3DCCF] text-[#6B6456] cursor-default'
                        : 'bg-[#1E1F22] hover:bg-[#34353A] text-white shadow-xs'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#245D3B]" />
                        <span>Price Applied</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Apply Suggested Price</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
