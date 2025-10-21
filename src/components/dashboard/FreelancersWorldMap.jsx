import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const FreelancersWorldMap = ({ title, freelancersData = {} }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Prepare heatmap data with color intensity
  const heatmapData = useMemo(() => {
    // Find max value for normalization
    const maxFreelancers = Math.max(
      1, // Ensure we don't divide by zero
      ...Object.values(freelancersData)
    );

    // Generate color scale function
    const getColorIntensity = (count) => {
      // Normalize the count between 0 and 1
      const normalizedIntensity = count / maxFreelancers;

      // Interpolate color from light to dark blue
      const r = Math.round(135 * (1 - normalizedIntensity));
      const g = Math.round(206 * (1 - normalizedIntensity));
      const b = Math.round(
        235 * (1 - normalizedIntensity) + 100 * normalizedIntensity
      );

      return `rgb(${r}, ${g}, ${b})`;
    };

    return {
      getColorIntensity,
      maxFreelancers,
    };
  }, [freelancersData]);

  // Prepare legend data
  const legendData = useMemo(() => {
    const { maxFreelancers, getColorIntensity } = heatmapData;

    // Create 5 legend steps
    return [
      {
        label: `1-${Math.round(maxFreelancers * 0.2)}`,
        color: getColorIntensity(maxFreelancers * 0.1),
      },
      {
        label: `${Math.round(maxFreelancers * 0.2)}-${Math.round(
          maxFreelancers * 0.4
        )}`,
        color: getColorIntensity(maxFreelancers * 0.3),
      },
      {
        label: `${Math.round(maxFreelancers * 0.4)}-${Math.round(
          maxFreelancers * 0.6
        )}`,
        color: getColorIntensity(maxFreelancers * 0.5),
      },
      {
        label: `${Math.round(maxFreelancers * 0.6)}-${Math.round(
          maxFreelancers * 0.8
        )}`,
        color: getColorIntensity(maxFreelancers * 0.7),
      },
      {
        label: `${Math.round(maxFreelancers * 0.8)}-${maxFreelancers}`,
        color: getColorIntensity(maxFreelancers * 0.9),
      },
    ];
  }, [heatmapData]);

  return (
    <div className="w-full mx-auto rounded-lg shadow-xl p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-700 mb-6">{title}</h1>

      {/* Legend */}
      <div className="flex">
        <div className="flex flex-col gap-3 mb-8 mr-4">
          {legendData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {item.label} Freelancers
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative w-full h-96 overflow-hidden">
          <ComposableMap>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Get all possible identifiers
                  const props = geo.properties;

                  // Comprehensive name extraction
                  const possibleNames = [
                    props.name,
                    props.NAME,
                    props.name_long,
                    props.NAME_LONG,
                    props.sovereignt,
                    props.SOVEREIGNT,
                    props.admin,
                    props.ADMIN,
                    props.name_en,
                    props.NAME_EN,
                  ].filter(Boolean);

                  const name = possibleNames[0] || "Unknown Country";

                  // Comprehensive code extraction
                  const possibleCodes = [
                    props.iso_a3,
                    props.ISO_A3,
                    props.adm0_a3,
                    props.ADM0_A3,
                    props.iso_a2,
                    props.ISO_A2,
                    props.adm0_a2,
                    props.ADM0_A2,
                  ].filter(Boolean);

                  const code3 = possibleCodes.find((code) => code.length === 3);
                  const code2 = possibleCodes.find((code) => code.length === 2);

                  // Try multiple ways to find the data
                  const freelancerCount =
                    freelancersData[code3] ||
                    freelancersData[code2] ||
                    possibleNames.reduce(
                      (count, countryName) =>
                        count || freelancersData[countryName],
                      0
                    );

                  // Get color intensity based on freelancer count
                  const fillColor =
                    freelancerCount > 0
                      ? heatmapData.getColorIntensity(freelancerCount)
                      : "#D6D6DA";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setHoveredCountry({
                          name: name,
                          count: freelancerCount,
                        });
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: "#F53",
                          stroke: "#ffffff",
                          strokeWidth: 1,
                        },
                        pressed: {
                          fill: "#E42",
                          stroke: "#ffffff",
                          strokeWidth: 1,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Tooltip */}
          {hoveredCountry && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white px-4 py-3 rounded-lg text-sm">
              <div className="font-medium">{hoveredCountry.name}</div>
              <div className="text-xs">Freelancers: {hoveredCountry.count}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancersWorldMap;
