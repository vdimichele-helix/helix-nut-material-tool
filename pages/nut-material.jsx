import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, FileDown } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { jsPDF } from 'jspdf';
import MaterialFilters from "../components/MaterialFilters";
import MaterialsTable from '../components/MaterialsTable';
import ComparisonView from '../components/ComparisonView';

export default function Home() {
  const [filters, setFilters] = useState({
    low_friction: null,
    wear_resistance: null,
    grease_compatibility: null,
    chemical_resistance: null,
    min_tensile_strength: null,
    min_limiting_pv: null,
    max_water_absorption: null,
    min_high_temp: null,
    max_low_temp: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

const { data: materials = [], isLoading } = useQuery({
  queryKey: ["nutMaterials"],
  queryFn: async () => {
    const res = await fetch("/data/nutMaterials.json");
    if (!res.ok) throw new Error("Failed to load materials");
    return res.json();
  },
});

  // Apply filters
  const filteredData = useMemo(() => {
    return materials.filter(material => {
      // Categorical filters
      if (filters.low_friction && material.low_friction !== filters.low_friction) return false;
      if (filters.wear_resistance && material.wear_resistance !== filters.wear_resistance) return false;
      if (filters.grease_compatibility && material.grease_compatibility !== filters.grease_compatibility) return false;
      if (filters.chemical_resistance && material.chemical_resistance !== filters.chemical_resistance) return false;
      
      // Numeric filters
      if (filters.min_tensile_strength && material.tensile_strength < filters.min_tensile_strength) return false;
      if (filters.min_limiting_pv && material.limiting_pv < filters.min_limiting_pv) return false;
      if (filters.max_water_absorption && material.water_absorption > filters.max_water_absorption) return false;
      if (filters.min_high_temp && material.high_temperature < filters.min_high_temp) return false;
      if (filters.max_low_temp && material.low_temperature > filters.max_low_temp) return false;
      
      // Search filter
      if (searchQuery && !material.material?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [materials, filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({
      low_friction: null,
      wear_resistance: null,
      grease_compatibility: null,
      chemical_resistance: null,
      min_tensile_strength: null,
      min_limiting_pv: null,
      max_water_absorption: null,
      min_high_temp: null,
      max_low_temp: null
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== null && v !== '').length;

  const handleToggleSelection = (materialId) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleClearSelection = () => {
    setSelectedMaterials([]);
    setShowComparison(false);
  };

  const handlePublishToPDF = (exportMode = 'filtered', includeComparison = false) => {
    const doc = new jsPDF('landscape');
    const dataToExport = exportMode === 'selected' ? selectedMaterialsData : filteredData;
    
    // Title
    doc.setFontSize(16);
    doc.text('Acme Nut and Lead Screw Nut Materials Reference Guide', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total Materials: ${dataToExport.length}`, 14, 27);
    if (exportMode === 'selected') {
      doc.text('Comparison Mode - Selected Materials Only', 14, 32);
    }
    
    // Comparison mode - show properties with differences highlighted
    if (includeComparison && dataToExport.length > 1) {
      const properties = [
        { key: 'low_friction', label: 'Low Friction' },
        { key: 'wear_resistance', label: 'Wear Resistance' },
        { key: 'tensile_strength', label: 'Tensile Strength' },
        { key: 'limiting_pv', label: 'Limiting PV' },
        { key: 'water_absorption', label: 'Water Absorption' },
        { key: 'grease_compatibility', label: 'Grease Compatibility' },
        { key: 'chemical_resistance', label: 'Chemical Resistance' },
        { key: 'low_temperature', label: 'Low Temp' },
        { key: 'high_temperature', label: 'High Temp' }
      ];
      
      let y = exportMode === 'selected' ? 40 : 35;
      
      // Material names as headers
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Property', 14, y);
      dataToExport.forEach((material, idx) => {
        doc.text(material.material.substring(0, 15), 70 + (idx * 60), y);
      });
      
      y += 7;
      doc.setFont(undefined, 'normal');
      
      // Properties comparison
      properties.forEach(prop => {
        if (y > 190) {
          doc.addPage();
          y = 20;
        }
        
        const values = dataToExport.map(m => m[prop.key]);
        const hasDifference = new Set(values).size > 1;
        
        doc.setFontSize(8);
        doc.text(prop.label, 14, y);
        
        if (hasDifference) {
          doc.text('*', 8, y); // Difference indicator
        }
        
        dataToExport.forEach((material, idx) => {
          const value = material[prop.key];
          const displayValue = typeof value === 'number' ? value.toLocaleString() : (value || '-');
          doc.text(String(displayValue).substring(0, 18), 70 + (idx * 60), y);
        });
        
        y += 6;
      });
      
      // Add legend
      y += 5;
      doc.setFontSize(7);
      doc.text('* Indicates differing values across materials', 14, y);
      
    } else {
      // Standard table mode
      let y = exportMode === 'selected' ? 40 : 35;
      const headers = ['Material', 'Low Friction', 'Wear Res.', 'Tensile Str.', 'Limiting PV', 'Water Abs.', 'Grease Compat.', 'Chem. Res.', 'Temp Range'];
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      headers.forEach((header, i) => {
        doc.text(header, 14 + (i * 30), y);
      });
      
      // Table data
      doc.setFont(undefined, 'normal');
      y += 7;
      dataToExport.forEach((material) => {
        if (y > 190) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(material.material.substring(0, 20), 14, y);
        doc.text(material.low_friction || '', 44, y);
        doc.text(material.wear_resistance || '', 74, y);
        doc.text(material.tensile_strength?.toLocaleString() || '', 104, y);
        doc.text(material.limiting_pv?.toLocaleString() || '', 134, y);
        doc.text(String(material.water_absorption || ''), 164, y);
        doc.text(material.grease_compatibility || '', 194, y);
        doc.text(material.chemical_resistance || '', 224, y);
        doc.text(`${material.low_temperature}° to ${material.high_temperature}°`, 254, y);
        
        y += 6;
      });
    }
    
    const filename = exportMode === 'selected' ? 'materials-comparison.pdf' : 'nut-materials-reference.pdf';
    doc.save(filename);
  };

  const selectedMaterialsData = materials.filter(m => selectedMaterials.includes(m.id));

  if (showComparison && selectedMaterials.length > 0) {
    return (
      <ComparisonView 
        materials={selectedMaterialsData}
        onBack={() => setShowComparison(false)}
        onClearSelection={handleClearSelection}
        onExportPDF={handlePublishToPDF}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
              Acme Nut and Lead Screw Nut Materials Reference Guide
            </h1>
            <p className="text-slate-600 text-lg">
              Advanced filtering and comparison of engineering nut materials
            </p>
          </div>
          <Button
            onClick={handlePublishToPDF}
            className="gap-2 bg-slate-900 hover:bg-slate-800"
          >
            <FileDown className="w-4 h-4" />
            Publish to PDF
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-slate-200 rounded-xl shadow-sm"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {activeFilterCount > 0 && (
                <div className="mb-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </div>
              )}
              <MaterialFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Results
                <span className="ml-2 text-slate-500 text-base font-normal">
                  ({filteredData.length} {filteredData.length === 1 ? 'material' : 'materials'})
                </span>
              </h2>
              
              {selectedMaterials.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {selectedMaterials.length} selected
                  </span>
                  <Button
                    onClick={() => setShowComparison(true)}
                    disabled={selectedMaterials.length < 2}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Compare ({selectedMaterials.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearSelection}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            
            <MaterialsTable 
              data={filteredData} 
              isLoading={isLoading}
              selectedMaterials={selectedMaterials}
              onToggleSelection={handleToggleSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
