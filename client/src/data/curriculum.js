import { PhysicsIcon, ChemistryIcon, BiologyIcon } from '../components/ui/Icons';
export const ncertCurriculum = {
            '9': {
                subjects: [
                    { id: 'phy', name: 'Physics', icon: PhysicsIcon, class: 9, chapters: [
                        { id: 'phy9-ch1', title: 'Motion', topics: [
                            { id: 'phy9-ch1-t1', title: 'Describing Motion' }, { id: 'phy9-ch1-t2', title: 'Measuring the Rate of Motion' }, { id: 'phy9-ch1-t3', title: 'Rate of Change of Velocity' }, { id: 'phy9-ch1-t4', title: 'Graphical Representation' }, { id: 'phy9-ch1-t5', title: 'Equations of Motion' }, { id: 'phy9-ch1-t6', title: 'Uniform Circular Motion' }
                        ], equations: [
                            { id: 'eq-phy9-1', title: 'Velocity-Time Relation', formula: 'v = u + at' }, { id: 'eq-phy9-2', title: 'Position-Time Relation', formula: 's = ut + (1/2)at²' }, { id: 'eq-phy9-3', title: 'Position-Velocity Relation', formula: 'v² = u² + 2as' }, { id: 'eq-phy9-4', title: 'Average Velocity', formula: 'v_avg = (u + v)/2' }, { id: 'eq-phy9-5', title: 'Velocity', formula: 'v = s/t' }
                        ]},
                        { id: 'phy9-ch2', title: 'Force & Laws of Motion', topics: [
                            { id: 'phy9-ch2-t1', title: 'Balanced & Unbalanced Forces' }, { id: 'phy9-ch2-t2', title: 'Newton\'s Laws' }, { id: 'phy9-ch2-t3', title: 'Inertia' }, { id: 'phy9-ch2-t4', title: 'Conservation of Momentum' }
                        ], equations: [
                            { id: 'eq-phy9-6', title: 'Force', formula: 'F = ma' }, { id: 'eq-phy9-7', title: 'Momentum', formula: 'p = mv' }, { id: 'eq-phy9-8', title: 'Impulse', formula: 'J = F·t = Δp' }, { id: 'eq-phy9-9', title: 'Conservation of Momentum', formula: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂' }
                        ]},
                        { id: 'phy9-ch3', title: 'Gravitation', topics: [
                            { id: 'phy9-ch3-t1', title: 'Universal Law' }, { id: 'phy9-ch3-t2', title: 'Free Fall' }, { id: 'phy9-ch3-t3', title: 'Mass & Weight' }, { id: 'phy9-ch3-t4', title: 'Pressure' }, { id: 'phy9-ch3-t5', title: 'Archimedes’ Principle' }, { id: 'phy9-ch3-t6', title: 'Relative Density' }
                        ], equations: [
                            { id: 'eq-phy9-10', title: 'Gravitational Force', formula: 'F = G(m₁m₂)/r²' }, { id: 'eq-phy9-11', title: 'Weight', formula: 'W = mg' }, { id: 'eq-phy9-12', title: 'Pressure', formula: 'P = F/A' }, { id: 'eq-phy9-13', title: 'Density', formula: 'ρ = m/V' }, { id: 'eq-phy9-14', title: 'Relative Density', formula: 'RD = ρ_substance/ρ_water' }
                        ]},
                        { id: 'phy9-ch4', title: 'Work & Energy', topics: [
                            { id: 'phy9-ch4-t1', title: 'Work' }, { id: 'phy9-ch4-t2', title: 'Energy' }, { id: 'phy9-ch4-t3', title: 'Kinetic & Potential Energy' }, { id: 'phy9-ch4-t4', title: 'Power' }, { id: 'phy9-ch4-t5', title: 'Conservation Law' }
                        ], equations: [
                            { id: 'eq-phy9-15', title: 'Work', formula: 'W = F·s' }, { id: 'eq-phy9-16', title: 'Kinetic Energy', formula: 'KE = (1/2)mv²' }, { id: 'eq-phy9-17', title: 'Potential Energy', formula: 'PE = mgh' }, { id: 'eq-phy9-18', title: 'Power', formula: 'P = W/t = Fv' }, { id: 'eq-phy9-19', title: 'Efficiency', formula: 'Efficiency = (out/in)x100%' }
                        ]},
                        { id: 'phy9-ch5', title: 'Sound', topics: [
                            { id: 'phy9-ch5-t1', title: 'Production & Propagation' }, { id: 'phy9-ch5-t2', title: 'Characteristics' }, { id: 'phy9-ch5-t3', title: 'Reflection' }, { id: 'phy9-ch5-t4', title: 'Range & Ultrasound' }, { id: 'phy9-ch5-t5', title: 'Human Ear' }, { id: 'phy9-ch5-t6', title: 'Applications' }
                        ], equations: [
                            { id: 'eq-phy9-20', title: 'Wave Speed', formula: 'v = λf' }, { id: 'eq-phy9-21', title: 'Echo Time', formula: 't = 2d/v' }, { id: 'eq-phy9-22', title: 'Echo Distance', formula: 'd = (v·t)/2' }
                        ]}
                    ]},
                    { id: 'chem', name: 'Chemistry', icon: ChemistryIcon, class: 9, chapters: [
                        { id: 'chem9-ch1', title: 'Matter in Our Surroundings', topics: [
                            { id: 'chem9-ch1-t1', title: 'Physical Nature' }, { id: 'chem9-ch1-t2', title: 'States' }, { id: 'chem9-ch1-t3', title: 'State Changes' }, { id: 'chem9-ch1-t4', title: 'Evaporation' }
                        ], equations: [
                            { id: 'eq-chem9-1', title: 'Kelvin Conversion', formula: 'K = °C + 273.15' }, { id: 'eq-chem9-2', title: 'Celsius Conversion', formula: '°C = K - 273.15' }
                        ]},
                        { id: 'chem9-ch2', title: 'Is Matter Around Us Pure', topics: [
                            { id: 'chem9-ch2-t1', title: 'Mixtures & Solutions' }, { id: 'chem9-ch2-t2', title: 'Separation' }, { id: 'chem9-ch2-t3', title: 'Changes' }, { id: 'chem9-ch2-t4', title: 'Types of Pure Substances' }
                        ], equations: [
                            { id: 'eq-chem9-3', title: 'Mass Percentage', formula: 'Mass% = (solute/solution)×100' }, { id: 'eq-chem9-4', title: 'Volume Percentage', formula: 'Vol% = (vol/solution)×100' }
                        ]},
                        { id: 'chem9-ch3', title: 'Atoms and Molecules', topics: [
                            { id: 'chem9-ch3-t1', title: 'Laws of Combination' }, { id: 'chem9-ch3-t2', title: 'Atoms' }, { id: 'chem9-ch3-t3', title: 'Formulae' }, { id: 'chem9-ch3-t4', title: 'Mole Concept' }, { id: 'chem9-ch3-t5', title: 'Formula Mass' }
                        ], equations: [
                            { id: 'eq-chem9-5', title: 'Moles', formula: 'n = m/M' }, { id: 'eq-chem9-6', title: 'Number of Particles', formula: 'Particles = n×NA' }, { id: 'eq-chem9-7', title: 'Atomic Mass Unit', formula: '1 amu = 1.66×10⁻²⁷ kg' }
                        ]},
                        { id: 'chem9-ch4', title: 'Structure of Atom', topics: [
                            { id: 'chem9-ch4-t1', title: 'Charged Particles' }, { id: 'chem9-ch4-t2', title: 'Models' }, { id: 'chem9-ch4-t3', title: 'Distribution' }, { id: 'chem9-ch4-t4', title: 'Valency' }, { id: 'chem9-ch4-t5', title: 'Isotopes & Isobars' }
                        ], equations: [
                            { id: 'eq-chem9-8', title: 'Mass Number', formula: 'A = Z + N' }
                        ]}
                    ]},
                    { id: 'bio', name: 'Biology', icon: BiologyIcon, class: 9, chapters: [
                        { id: 'bio9-ch1', title: 'The Fundamental Unit of Life', topics: [
                            { id: 'bio9-ch1-t1', title: 'Living Organisms Structure' }, { id: 'bio9-ch1-t2', title: 'Organisation' }, { id: 'bio9-ch1-t3', title: 'Organelles' }, { id: 'bio9-ch1-t4', title: 'Cell Division' }, { id: 'bio9-ch1-t5', title: 'Cell Types' }
                        ], equations: []},
                        { id: 'bio9-ch2', title: 'Tissues', topics: [
                            { id: 'bio9-ch2-t1', title: 'Plant/Animal Tissues' }, { id: 'bio9-ch2-t2', title: 'Types' }, { id: 'bio9-ch2-t3', title: 'Structure' }
                        ], equations: []},
                        { id: 'bio9-ch3', title: 'Improvement in Food Resources', topics: [
                            { id: 'bio9-ch3-t1', title: 'Crop Yields' }, { id: 'bio9-ch3-t2', title: 'Animal Husbandry' }, { id: 'bio9-ch3-t3', title: 'Plant Breeding' }, { id: 'bio9-ch3-t4', title: 'Fertilizers' }
                        ], equations: []}
                    ]}
                ]
            },
            '10': {
                subjects: [
                    { id: 'phy', name: 'Physics', icon: PhysicsIcon, class: 10, chapters: [
                        { id: 'phy10-ch1', title: 'Light – Reflection and Refraction', topics: [
                            { id: 'phy10-ch1-t1', title: 'Reflection' }, { id: 'phy10-ch1-t2', title: 'Spherical Mirrors' }, { id: 'phy10-ch1-t3', title: 'Refraction' }, { id: 'phy10-ch1-t4', title: 'Glass Slab' }, { id: 'phy10-ch1-t5', title: 'Lenses' }, { id: 'phy10-ch1-t6', title: 'Image Formation by Lenses' }
                        ], equations: [
                            { id: 'eq-phy10-1', title: 'Mirror Formula', formula: '1/f = 1/v + 1/u' }, { id: 'eq-phy10-2', title: 'Magnification', formula: 'm = -v/u = hi/ho' }, { id: 'eq-phy10-3', title: 'Snell\'s Law', formula: 'n₁ sin i = n₂ sin r' }, { id: 'eq-phy10-4', title: 'Lens Formula', formula: '1/f = 1/v - 1/u' }, { id: 'eq-phy10-5', title: 'Refractive Index', formula: 'n = c/v' }
                        ]},
                        { id: 'phy10-ch2', title: 'The Human Eye and The Colourful World', topics: [
                            { id: 'phy10-ch2-t1', title: 'Human Eye' }, { id: 'phy10-ch2-t2', title: 'Vision Defects' }, { id: 'phy10-ch2-t3', title: 'Prism Refraction' }, { id: 'phy10-ch2-t4', title: 'Dispersion' }, { id: 'phy10-ch2-t5', title: 'Atmospheric Refraction' }, { id: 'phy10-ch2-t6', title: 'Scattering' }
                        ], equations: [
                            { id: 'eq-phy10-6', title: 'Power of Lens', formula: 'P = 1/f (Dioptres)' }, { id: 'eq-phy10-7', title: 'Combination of Lenses', formula: 'P = P₁ + P₂' }
                        ]},
                        { id: 'phy10-ch3', title: 'Electricity', topics: [
                            { id: 'phy10-ch3-t1', title: 'Electric Current' }, { id: 'phy10-ch3-t2', title: 'Circuits' }, { id: 'phy10-ch3-t3', title: 'Ohm\'s Law' }, { id: 'phy10-ch3-t4', title: 'Resistance' }, { id: 'phy10-ch3-t5', title: 'Power' }, { id: 'phy10-ch3-t6', title: 'Kirchhoff\'s Laws' }
                        ], equations: [
                            { id: 'eq-phy10-8', title: 'Ohm\'s Law', formula: 'V = IR' }, { id: 'eq-phy10-9', title: 'Resistance', formula: 'R = ρ(L/A)' }, { id: 'eq-phy10-10', title: 'Power', formula: 'P = VI = I²R = V²/R' }, { id: 'eq-phy10-11', title: 'Heating Effect', formula: 'H = I²Rt' }
                        ]},
                        { id: 'phy10-ch4', title: 'Magnetic Effects of Electric Current', topics: [
                            { id: 'phy10-ch4-t1', title: 'Magnetic Fields' }, { id: 'phy10-ch4-t2', title: 'Force on Current' }, { id: 'phy10-ch4-t3', title: 'Electric Motor' }, { id: 'phy10-ch4-t4', title: 'Electromagnetic Induction' }, { id: 'phy10-ch4-t5', title: 'Generator' }
                        ], equations: [
                            { id: 'eq-phy10-12', title: 'Magnetic Force', formula: 'F = BIL sin θ' }
                        ]}
                    ]},
                    { id: 'chem', name: 'Chemistry', icon: ChemistryIcon, class: 10, chapters: [
                        { id: 'chem10-ch1', title: 'Chemical Reactions and Equations', topics: [
                            { id: 'chem10-ch1-t1', title: 'Chemical Equations' }, { id: 'chem10-ch1-t2', title: 'Reaction Types' }, { id: 'chem10-ch1-t3', title: 'Oxidation' }, { id: 'chem10-ch1-t4', title: 'Reduction' }
                        ], equations: [
                            { id: 'eq-chem10-1', title: 'Combination', formula: 'A+B → AB' }, { id: 'eq-chem10-2', title: 'Decomposition', formula: 'AB → A+B' }, { id: 'eq-chem10-3', title: 'Displacement', formula: 'A + BC → AC + B' }, { id: 'eq-chem10-4', title: 'Double Displacement', formula: 'AB + CD → AD + CB' }
                        ]},
                        { id: 'chem10-ch2', title: 'Acids, Bases and Salts', topics: [
                            { id: 'chem10-ch2-t1', title: 'Properties' }, { id: 'chem10-ch2-t2', title: 'pH Scale' }, { id: 'chem10-ch2-t3', title: 'Neutralization' }, { id: 'chem10-ch2-t4', title: 'Salts' }
                        ], equations: [
                            { id: 'eq-chem10-5', title: 'Neutralization', formula: 'Acid + Base → Salt + Water' }, { id: 'eq-chem10-6', title: 'pH', formula: 'pH = -log[H⁺]' }, { id: 'eq-chem10-7', title: 'pOH', formula: 'pH + pOH = 14' }
                        ]},
                        { id: 'chem10-ch3', title: 'Metals and Non-metals', topics: [
                            { id: 'chem10-ch3-t1', title: 'Physical & Chemical Properties' }, { id: 'chem10-ch3-t2', title: 'Extraction' }, { id: 'chem10-ch3-t3', title: 'Corrosion' }
                        ], equations: [
                            { id: 'eq-chem10-8', title: 'Metal Reaction', formula: 'Metal + Acid → Salt + Hydrogen Gas' }
                        ]},
                        { id: 'chem10-ch4', title: 'Carbon and its Compounds', topics: [
                            { id: 'chem10-ch4-t1', title: 'Covalent Bonding' }, { id: 'chem10-ch4-t2', title: 'Properties' }, { id: 'chem10-ch4-t3', title: 'Soaps and Detergents' }
                        ], equations: [
                            { id: 'eq-chem10-9', title: 'Combustion', formula: 'CH₄ + 2O₂ → CO₂ + 2H₂O' }
                        ]},
                        { id: 'chem10-ch5', title: 'Periodic Classification of Elements', topics: [
                            { id: 'chem10-ch5-t1', title: 'Mendeleev\'s Table' }, { id: 'chem10-ch5-t2', title: 'Modern Periodic Table' }, { id: 'chem10-ch5-t3', title: 'Trends' }
                        ], equations: []}
                    ]},
                    { id: 'bio', name: 'Biology', icon: BiologyIcon, class: 10, chapters: [
                        { id: 'bio10-ch1', title: 'Life Processes', topics: [
                            { id: 'bio10-ch1-t1', title: 'Nutrition' }, { id: 'bio10-ch1-t2', title: 'Respiration' }, { id: 'bio10-ch1-t3', title: 'Transportation' }, { id: 'bio10-ch1-t4', title: 'Excretion' }
                        ], equations: [
                            { id: 'eq-bio10-1', title: 'Photosynthesis', formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' }, { id: 'eq-bio10-2', title: 'Respiration', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy' }
                        ]},
                        { id: 'bio10-ch2', title: 'Control and Coordination', topics: [
                            { id: 'bio10-ch2-t1', title: 'Nervous System' }, { id: 'bio10-ch2-t2', title: 'Plant Coordination' }, { id: 'bio10-ch2-t3', title: 'Hormones' }
                        ], equations: []},
                        { id: 'bio10-ch3', title: 'How do Organisms Reproduce?', topics: [
                            { id: 'bio10-ch3-t1', title: 'Asexual and Sexual Reproduction' }
                        ], equations: []},
                        { id: 'bio10-ch4', title: 'Heredity and Evolution', topics: [
                            { id: 'bio10-ch4-t1', title: 'Genetic Variation' }, { id: 'bio10-ch4-t2', title: 'Inheritance' }, { id: 'bio10-ch4-t3', title: 'Evolution' }
                        ], equations: []},
                        { id: 'bio10-ch5', title: 'Our Environment', topics: [
                            { id: 'bio10-ch5-t1', title: 'Ecosystems' }, { id: 'bio10-ch5-t2', title: 'Food Chains' }, { id: 'bio10-ch5-t3', title: 'Human Impact' }
                        ], equations: []}
                    ]}
                ]
            },
            '11': {
                subjects: [
                    { id: 'phy', name: 'Physics', icon: PhysicsIcon, class: 11, chapters: [
                        { id: 'phy11-ch1', title: 'Units and Measurements', topics: [ { id: 'phy11-ch1-t1', title: 'SI Units' }, { id: 'phy11-ch1-t2', title: 'Errors' }, { id: 'phy11-ch1-t3', title: 'Dimensional Analysis' } ], equations: []},
                        { id: 'phy11-ch2', title: 'Motion in a Straight Line', topics: [ { id: 'phy11-ch2-t1', title: 'Average Velocity' }, { id: 'phy11-ch2-t2', title: 'Instantaneous Velocity' }, { id: 'phy11-ch2-t3', title: 'Acceleration' } ], equations: [ { id: 'eq-phy11-1', title: 'Average Velocity', formula: 'v_avg = Δx/Δt' }, { id: 'eq-phy11-2', title: 'Instantaneous Velocity', formula: 'v = dx/dt' }, { id: 'eq-phy11-3', title: 'Acceleration', formula: 'a = dv/dt' } ]},
                        { id: 'phy11-ch3', title: 'Motion in a Plane', topics: [ { id: 'phy11-ch3-t1', title: 'Vectors' }, { id: 'phy11-ch3-t2', title: 'Projectile Motion' }, { id: 'phy11-ch3-t3', title: 'Circular Motion' } ], equations: [ { id: 'eq-phy11-4', title: 'Vector Resultant', formula: 'R = √(A² + B² + 2ABcosθ)' }, { id: 'eq-phy11-5', title: 'Projectile Range', formula: 'Range = u²sin2θ/g' } ]},
                        { id: 'phy11-ch4', title: 'Laws of Motion', topics: [ { id: 'phy11-ch4-t1', title: 'Newton\'s Laws' }, { id: 'phy11-ch4-t2', title: 'Friction' }, { id: 'phy11-ch4-t3', title: 'Momentum Conservation' } ], equations: [ { id: 'eq-phy11-6', title: 'Force', formula: 'F = ma = dp/dt' }, { id: 'eq-phy11-7', title: 'Momentum', formula: 'p = mv' }, { id: 'eq-phy11-8', title: 'Impulse', formula: 'J = FΔt' } ]},
                        { id: 'phy11-ch5', title: 'Work, Energy and Power', topics: [ { id: 'phy11-ch5-t1', title: 'Work-Energy Theorem' }, { id: 'phy11-ch5-t2', title: 'KE, PE' }, { id: 'phy11-ch5-t3', title: 'Power' } ], equations: [ { id: 'eq-phy11-9', title: 'Work Done', formula: 'W = F·s cosθ' }, { id: 'eq-phy11-10', title: 'Kinetic Energy', formula: 'KE = ½mv²' }, { id: 'eq-phy11-11', title: 'Potential Energy', formula: 'PE = mgh' } ]},
                        { id: 'phy11-ch6', title: 'System of Particles & Rotational Motion', topics: [ { id: 'phy11-ch6-t1', title: 'Centre of Mass' }, { id: 'phy11-ch6-t2', title: 'Torque' }, { id: 'phy11-ch6-t3', title: 'Angular Momentum' } ], equations: [ { id: 'eq-phy11-12', title: 'Center of Mass', formula: 'r_cm = Σm_ir_i/M' }, { id: 'eq-phy11-13', title: 'Torque', formula: 'τ = Iα' }, { id: 'eq-phy11-14', title: 'Angular Momentum', formula: 'L = Iω' } ]},
                        { id: 'phy11-ch7', title: 'Gravitation', topics: [ { id: 'phy11-ch7-t1', title: 'Kepler\'s Laws' }, { id: 'phy11-ch7-t2', title: 'Satellites' }, { id: 'phy11-ch7-t3', title: 'Escape Velocity' } ], equations: [ { id: 'eq-phy11-15', title: 'Gravitational Force', formula: 'F = G(m₁m₂)/r²' }, { id: 'eq-phy11-16', title: 'Escape Velocity', formula: 'v_e = √(2GM/R)' } ]},
                        { id: 'phy11-ch8', title: 'Mechanical Properties of Solids', topics: [ { id: 'phy11-ch8-t1', title: 'Stress' }, { id: 'phy11-ch8-t2', title: 'Strain' }, { id: 'phy11-ch8-t3', title: 'Elastic Moduli' } ], equations: [ { id: 'eq-phy11-17', title: 'Stress', formula: 'Stress = F/A' }, { id: 'eq-phy11-18', title: 'Strain', formula: 'Strain = ΔL/L' }, { id: 'eq-phy11-19', title: 'Young\'s Modulus', formula: 'Y = Stress/Strain' } ]},
                        { id: 'phy11-ch9', title: 'Mechanical Properties of Fluids', topics: [ { id: 'phy11-ch9-t1', title: 'Pressure' }, { id: 'phy11-ch9-t2', title: 'Bernoulli\'s Theorem' }, { id: 'phy11-ch9-t3', title: 'Viscosity' } ], equations: [ { id: 'eq-phy11-20', title: 'Pressure in Fluid', formula: 'P = ρgh' }, { id: 'eq-phy11-21', title: 'Bernoulli\'s Equation', formula: 'P + ½ρv² + ρgh = constant' } ]},
                        { id: 'phy11-ch10', title: 'Thermal Properties of Matter', topics: [ { id: 'phy11-ch10-t1', title: 'Heat Transfer' }, { id: 'phy11-ch10-t2', title: 'Gas Laws' }, { id: 'phy11-ch10-t3', title: 'Expansion' } ], equations: [ { id: 'eq-phy11-22', title: 'Ideal Gas Law', formula: 'PV = nRT' }, { id: 'eq-phy11-23', title: 'Linear Expansion', formula: 'ΔL = L₀αΔT' }, { id: 'eq-phy11-24', title: 'Heat Capacity', formula: 'Q = mcΔT' } ]},
                        { id: 'phy11-ch11', title: 'Thermodynamics', topics: [ { id: 'phy11-ch11-t1', title: 'Laws' }, { id: 'phy11-ch11-t2', title: 'Heat Engines' }, { id: 'phy11-ch11-t3', title: 'Entropy' } ], equations: [ { id: 'eq-phy11-25', title: 'First Law', formula: 'ΔU = Q - W' }, { id: 'eq-phy11-26', title: 'Engine Efficiency', formula: 'η = 1 - Q_c/Q_h' } ]},
                        { id: 'phy11-ch12', title: 'Kinetic Theory', topics: [ { id: 'phy11-ch12-t1', title: 'Gas Behavior' }, { id: 'phy11-ch12-t2', title: 'Equipartition of Energy' } ], equations: [ { id: 'eq-phy11-27', title: 'Pressure of Gas', formula: 'P = ⅓ρ ⟨ v² ⟩' }, { id: 'eq-phy11-28', title: 'RMS Velocity', formula: 'v_rms = √(3RT/M)' } ]},
                        { id: 'phy11-ch13', title: 'Oscillations', topics: [ { id: 'phy11-ch13-t1', title: 'SHM' }, { id: 'phy11-ch13-t2', title: 'Pendulum' }, { id: 'phy11-ch13-t3', title: 'Energy in Oscillations' } ], equations: [ { id: 'eq-phy11-29', title: 'SHM Equation', formula: 'x = A sin(ωt + φ)' }, { id: 'eq-phy11-30', title: 'Time Period (Spring)', formula: 'T = 2π√(m/k)' } ]},
                        { id: 'phy11-ch14', title: 'Waves', topics: [ { id: 'phy11-ch14-t1', title: 'Wave Equation' }, { id: 'phy11-ch14-t2', title: 'Doppler Effect' }, { id: 'phy11-ch14-t3', title: 'Beats' } ], equations: [ { id: 'eq-phy11-31', title: 'Wave Equation', formula: 'y = A sin(kx - ωt + φ)' }, { id: 'eq-phy11-32', title: 'Doppler Effect', formula: 'f\' = f(v±v_r)/(v±v_s)' } ]}
                    ]},
                    { id: 'chem', name: 'Chemistry', icon: ChemistryIcon, class: 11, chapters: [
                        { id: 'chem11-ch1', title: 'Some Basic Concepts of Chemistry', topics: [ { id: 'chem11-ch1-t1', title: 'Mole Concept' }, { id: 'chem11-ch1-t2', title: 'Stoichiometry' }, { id: 'chem11-ch1-t3', title: 'Molarity' } ], equations: [ { id: 'eq-chem11-1', title: 'Moles', formula: 'n = m/M' }, { id: 'eq-chem11-2', title: 'Molarity', formula: 'M = n/V' } ]},
                        { id: 'chem11-ch2', title: 'Structure of Atom', topics: [ { id: 'chem11-ch2-t1', title: 'Quantum Numbers' }, { id: 'chem11-ch2-t2', title: 'Atomic Models' } ], equations: [ { id: 'eq-chem11-3', title: 'Energy Levels', formula: 'E_n = -13.6/n² eV' }, { id: 'eq-chem11-4', title: 'Rydberg Formula', formula: '1/λ = R(1/n₁² - 1/n₂²)' } ]},
                        { id: 'chem11-ch3', title: 'Classification & Periodicity', topics: [ { id: 'chem11-ch3-t1', title: 'Periodic Table' }, { id: 'chem11-ch3-t2', title: 'Electronic Configuration' }, { id: 'chem11-ch3-t3', title: 'Trends' } ], equations: []},
                        { id: 'chem11-ch4', title: 'Chemical Bonding', topics: [ { id: 'chem11-ch4-t1', title: 'VSEPR' }, { id: 'chem11-ch4-t2', title: 'Hybridization' }, { id: 'chem11-ch4-t3', title: 'Molecular Orbital Theory' } ], equations: [ { id: 'eq-chem11-5', title: 'Bond Order', formula: 'Bond Order = (N_b - N_a)/2' }, { id: 'eq-chem11-6', title: 'Formal Charge', formula: 'Formal Charge = V - N - B/2' } ]},
                        { id: 'chem11-ch5', title: 'Thermodynamics', topics: [ { id: 'chem11-ch5-t1', title: 'Enthalpy' }, { id: 'chem11-ch5-t2', title: 'Entropy' }, { id: 'chem11-ch5-t3', title: 'Gibbs Energy' } ], equations: [ { id: 'eq-chem11-7', title: 'Enthalpy Change', formula: 'ΔH = ΔU + ΔnRT' }, { id: 'eq-chem11-8', title: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS' } ]},
                        { id: 'chem11-ch6', title: 'Equilibrium', topics: [ { id: 'chem11-ch6-t1', title: 'Le Chatelier\'s Principle' }, { id: 'chem11-ch6-t2', title: 'Acid-Base Equilibrium' } ], equations: [ { id: 'eq-chem11-9', title: 'Equilibrium Constant', formula: 'K = [products]/[reactants]' }, { id: 'eq-chem11-10', title: 'pH', formula: 'pH = -log[H⁺]' } ]},
                        { id: 'chem11-ch7', title: 'Redox Reactions', topics: [ { id: 'chem11-ch7-t1', title: 'Oxidation Numbers' }, { id: 'chem11-ch7-t2', title: 'Electron Transfer' } ], equations: []},
                        { id: 'chem11-ch8', title: 'Organic Chemistry: Basic Principles', topics: [ { id: 'chem11-ch8-t1', title: 'Hydrocarbon Classification' }, { id: 'chem11-ch8-t2', title: 'Nomenclature' }, { id: 'chem11-ch8-t3', title: 'Isomerism' } ], equations: []},
                        { id: 'chem11-ch9', title: 'Hydrocarbons', topics: [ { id: 'chem11-ch9-t1', title: 'Alkanes, Alkenes, Alkynes' }, { id: 'chem11-ch9-t2', title: 'Aromatic Compounds' } ], equations: []}
                    ]},
                    { id: 'bio', name: 'Biology', icon: BiologyIcon, class: 11, chapters: [
                        { id: 'bio11-ch1', title: 'The Living World', topics: [ { id: 'bio11-ch1-t1', title: 'Diversity' }, { id: 'bio11-ch1-t2', title: 'Taxonomy' }, { id: 'bio11-ch1-t3', title: 'Nomenclature' } ], equations: []},
                        { id: 'bio11-ch2', title: 'Biological Classification', topics: [ { id: 'bio11-ch2-t1', title: 'Five Kingdoms' }, { id: 'bio11-ch2-t2', title: 'Viruses' }, { id: 'bio11-ch2-t3', title: 'Lichens' } ], equations: []},
                        { id: 'bio11-ch3', title: 'Plant Kingdom', topics: [ { id: 'bio11-ch3-t1', title: 'Algae' }, { id: 'bio11-ch3-t2', title: 'Bryophytes' }, { id: 'bio11-ch3-t3', title: 'Pteridophytes' }, { id: 'bio11-ch3-t4', title: 'Gymnosperms' }, { id: 'bio11-ch3-t5', title: 'Angiosperms' } ], equations: []},
                        { id: 'bio11-ch4', title: 'Animal Kingdom', topics: [ { id: 'bio11-ch4-t1', title: 'Classification' }, { id: 'bio11-ch4-t2', title: 'Phyla from Porifera to Chordata' } ], equations: []},
                        { id: 'bio11-ch5', title: 'Morphology of Flowering Plants', topics: [ { id: 'bio11-ch5-t1', title: 'Root, Stem, Leaf' }, { id: 'bio11-ch5-t2', title: 'Flower, Fruit, Seed Structure' } ], equations: []},
                        { id: 'bio11-ch6', title: 'Anatomy of Flowering Plants', topics: [ { id: 'bio11-ch6-t1', title: 'Tissues' }, { id: 'bio11-ch6-t2', title: 'Secondary Growth' } ], equations: []},
                        { id: 'bio11-ch7', title: 'Structural Organisation in Animals', topics: [ { id: 'bio11-ch7-t1', title: 'Animal Tissues' }, { id: 'bio11-ch7-t2', title: 'Organ Systems' } ], equations: []},
                        { id: 'bio11-ch8', title: 'Cell: The Unit of Life', topics: [ { id: 'bio11-ch8-t1', title: 'Cell Theory' }, { id: 'bio11-ch8-t2', title: 'Prokaryotic vs Eukaryotic Cells' } ], equations: []},
                        { id: 'bio11-ch9', title: 'Biomolecules', topics: [ { id: 'bio11-ch9-t1', title: 'Proteins' }, { id: 'bio11-ch9-t2', title: 'Carbohydrates' }, { id: 'bio11-ch9-t3', title: 'Nucleic Acids' }, { id: 'bio11-ch9-t4', title: 'Enzymes' } ], equations: [ { id: 'eq-bio11-1', title: 'Enzyme Kinetics', formula: 'v = V_max[S]/(K_m + [S])' } ]},
                        { id: 'bio11-ch10', title: 'Cell Cycle and Cell Division', topics: [ { id: 'bio11-ch10-t1', title: 'Mitosis' }, { id: 'bio11-ch10-t2', title: 'Meiosis' }, { id: 'bio11-ch10-t3', title: 'Cell Cycle Regulation' } ], equations: []},
                        { id: 'bio11-ch11', title: 'Photosynthesis in Higher Plants', topics: [ { id: 'bio11-ch11-t1', title: 'Light Reactions' }, { id: 'bio11-ch11-t2', title: 'Calvin Cycle' }, { id: 'bio11-ch11-t3', title: 'C₄ Pathway' } ], equations: [ { id: 'eq-bio11-2', title: 'Photosynthesis', formula: '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O' } ]},
                        { id: 'bio11-ch12', title: 'Respiration in Plants', topics: [ { id: 'bio11-ch12-t1', title: 'Glycolysis' }, { id: 'bio11-ch12-t2', title: 'Krebs Cycle' }, { id: 'bio11-ch12-t3', title: 'Electron Transport' } ], equations: [ { id: 'eq-bio11-3', title: 'Cellular Respiration', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP' } ]},
                        { id: 'bio11-ch13', title: 'Plant Growth and Development', topics: [ { id: 'bio11-ch13-t1', title: 'Plant Hormones' }, { id: 'bio11-ch13-t2', title: 'Photoperiodism' }, { id: 'bio11-ch13-t3', title: 'Vernalization' } ], equations: []},
                        { id: 'bio11-ch14', title: 'Breathing and Exchange of Gases', topics: [ { id: 'bio11-ch14-t1', title: 'Respiratory System' }, { id: 'bio11-ch14-t2', title: 'Gas Exchange' } ], equations: []},
                        { id: 'bio11-ch15', title: 'Body Fluids and Circulation', topics: [ { id: 'bio11-ch15-t1', title: 'Blood' }, { id: 'bio11-ch15-t2', title: 'Heart' }, { id: 'bio11-ch15-t3', title: 'Circulation' } ], equations: []},
                        { id: 'bio11-ch16', title: 'Excretory Products and Elimination', topics: [ { id: 'bio11-ch16-t1', title: 'Kidney Function' }, { id: 'bio11-ch16-t2', title: 'Urine Formation' } ], equations: []},
                        { id: 'bio11-ch17', title: 'Locomotion and Movement', topics: [ { id: 'bio11-ch17-t1', title: 'Musculoskeletal System' } ], equations: []},
                        { id: 'bio11-ch18', title: 'Neural Control and Coordination', topics: [ { id: 'bio11-ch18-t1', title: 'Nervous System' }, { id: 'bio11-ch18-t2', title: 'Reflex Action' } ], equations: []},
                        { id: 'bio11-ch19', title: 'Chemical Coordination and Integration', topics: [ { id: 'bio11-ch19-t1', title: 'Endocrine System' }, { id: 'bio11-ch19-t2', title: 'Hormones' } ], equations: []}
                    ]}
                ]
            },
            '12': {
                subjects: [
                    { id: 'phy', name: 'Physics', icon: PhysicsIcon, class: 12, chapters: [
                        { id: 'phy12-ch1', title: 'Electric Charges and Fields', topics: [ { id: 'phy12-ch1-t1', title: 'Coulomb\'s Law' }, { id: 'phy12-ch1-t2', title: 'Electric Field' }, { id: 'phy12-ch1-t3', title: 'Gauss\'s Law' } ], equations: [ { id: 'eq-phy12-1', title: 'Coulomb\'s Law', formula: 'F = (1/4πε₀)(q₁q₂)/r²' }, { id: 'eq-phy12-2', title: 'Electric Field', formula: 'E = F/q₀' }, { id: 'eq-phy12-3', title: 'Gauss\'s Law', formula: '∮ E·dA = Q/ε₀' } ]},
                        { id: 'phy12-ch2', title: 'Electrostatic Potential and Capacitance', topics: [ { id: 'phy12-ch2-t1', title: 'Electric Potential' }, { id: 'phy12-ch2-t2', title: 'Capacitors' }, { id: 'phy12-ch2-t3', title: 'Energy' } ], equations: [ { id: 'eq-phy12-4', title: 'Electric Potential', formula: 'V = (1/4πε₀)(Q/r)' }, { id: 'eq-phy12-5', title: 'Capacitance', formula: 'C = Q/V' }, { id: 'eq-phy12-6', title: 'Capacitor Energy', formula: 'U = ½CV²' } ]},
                        { id: 'phy12-ch3', title: 'Current Electricity', topics: [ { id: 'phy12-ch3-t1', title: 'Ohm\'s Law' }, { id: 'phy12-ch3-t2', title: 'Kirchhoff\'s Laws' }, { id: 'phy12-ch3-t3', title: 'Power' } ], equations: [ { id: 'eq-phy12-7', title: 'Ohm\'s Law', formula: 'V = IR' }, { id: 'eq-phy12-8', title: 'Kirchhoff\'s Current Law', formula: 'ΣI_in = ΣI_out' }, { id: 'eq-phy12-9', title: 'Power', formula: 'P = VI = I²R' } ]},
                        { id: 'phy12-ch4', title: 'Moving Charges and Magnetism', topics: [ { id: 'phy12-ch4-t1', title: 'Lorentz Force' }, { id: 'phy12-ch4-t2', title: 'Biot-Savart Law' }, { id: 'phy12-ch4-t3', title: 'Ampere\'s Law' } ], equations: [ { id: 'eq-phy12-10', title: 'Lorentz Force', formula: 'F = q(E + v×B)' }, { id: 'eq-phy12-11', title: 'Ampere\'s Law', formula: '∮ B·dl = μ₀I' } ]},
                        { id: 'phy12-ch5', title: 'Magnetism and Matter', topics: [ { id: 'phy12-ch5-t1', title: 'Magnetic Dipoles' }, { id: 'phy12-ch5-t2', title: 'Earth\'s Magnetism' } ], equations: [ { id: 'eq-phy12-12', title: 'Magnetic Moment', formula: 'μ = IA' }, { id: 'eq-phy12-13', title: 'Torque on Dipole', formula: 'τ = μ×B' } ]},
                        { id: 'phy12-ch6', title: 'Electromagnetic Induction', topics: [ { id: 'phy12-ch6-t1', title: 'Faraday\'s Law' }, { id: 'phy12-ch6-t2', title: 'Lenz\'s Law' }, { id: 'phy12-ch6-t3', title: 'Self-Inductance' } ], equations: [ { id: 'eq-phy12-14', title: 'Faraday\'s Law', formula: 'ε = -dΦ/dt' }, { id: 'eq-phy12-15', title: 'Self-Inductance EMF', formula: 'ε = -L(dI/dt)' } ]},
                        { id: 'phy12-ch7', title: 'Alternating Current', topics: [ { id: 'phy12-ch7-t1', title: 'AC Circuits' }, { id: 'phy12-ch7-t2', title: 'Resonance' }, { id: 'phy12-ch7-t3', title: 'Transformers' } ], equations: [ { id: 'eq-phy12-16', title: 'AC Voltage', formula: 'V = V₀sinωt' }, { id: 'eq-phy12-17', title: 'Impedance', formula: 'Z = √(R² + (X_L - X_C)²)' } ]},
                        { id: 'phy12-ch8', title: 'Electromagnetic Waves', topics: [ { id: 'phy12-ch8-t1', title: 'Maxwell\'s Equations' }, { id: 'phy12-ch8-t2', title: 'EM Spectrum' } ], equations: [ { id: 'eq-phy12-18', title: 'Speed of Light', formula: 'c = 1/√(μ₀ε₀)' }, { id: 'eq-phy12-19', title: 'Wave Relation', formula: 'c = fλ' } ]},
                        { id: 'phy12-ch9', title: 'Ray Optics and Optical Instruments', topics: [ { id: 'phy12-ch9-t1', title: 'Reflection' }, { id: 'phy12-ch9-t2', title: 'Refraction' }, { id: 'phy12-ch9-t3', title: 'Lenses, Mirrors' } ], equations: [ { id: 'eq-phy12-20', title: 'Mirror Formula', formula: '1/f = 1/v + 1/u' }, { id: 'eq-phy12-21', title: 'Snell\'s Law', formula: 'n₁sinθ₁ = n₂sinθ₂' } ]},
                        { id: 'phy12-ch10', title: 'Wave Optics', topics: [ { id: 'phy12-ch10-t1', title: 'Interference' }, { id: 'phy12-ch10-t2', title: 'Diffraction' }, { id: 'phy12-ch10-t3', title: 'Polarization' } ], equations: [ { id: 'eq-phy12-22', title: 'Fringe Width', formula: 'β = λD/d' }, { id: 'eq-phy12-23', title: 'Malus\' Law', formula: 'I = I₀cos²θ' } ]},
                        { id: 'phy12-ch11', title: 'Dual Nature of Radiation and Matter', topics: [ { id: 'phy12-ch11-t1', title: 'Photoelectric Effect' }, { id: 'phy12-ch11-t2', title: 'de Broglie Waves' } ], equations: [ { id: 'eq-phy12-24', title: 'Photoelectric Equation', formula: 'hf = φ + KE_max' }, { id: 'eq-phy12-25', title: 'de Broglie Wavelength', formula: 'λ = h/mv' } ]},
                        { id: 'phy12-ch12', title: 'Atoms', topics: [ { id: 'phy12-ch12-t1', title: 'Bohr Model' }, { id: 'phy12-ch12-t2', title: 'Atomic Spectra' }, { id: 'phy12-ch12-t3', title: 'X-rays' } ], equations: [ { id: 'eq-phy12-26', title: 'Energy Levels', formula: 'E_n = -13.6/n² eV' }, { id: 'eq-phy12-27', title: 'Rydberg Formula', formula: '1/λ = R(1/n₁² - 1/n₂²)' } ]},
                        { id: 'phy12-ch13', title: 'Nuclei', topics: [ { id: 'phy12-ch13-t1', title: 'Radioactivity' }, { id: 'phy12-ch13-t2', title: 'Nuclear Reactions' }, { id: 'phy12-ch13-t3', title: 'Mass-Energy' } ], equations: [ { id: 'eq-phy12-28', title: 'Mass-Energy Equivalence', formula: 'E = mc²' }, { id: 'eq-phy12-29', title: 'Radioactive Decay', formula: 'N = N₀e^(-λt)' }, { id: 'eq-phy12-30', title: 'Half-Life', formula: 't₁/₂ = 0.693/λ' } ]},
                        { id: 'phy12-ch14', title: 'Semiconductor Electronics', topics: [ { id: 'phy12-ch14-t1', title: 'Diodes' }, { id: 'phy12-ch14-t2', title: 'Transistors' }, { id: 'phy12-ch14-t3', title: 'Logic Gates' } ], equations: [ { id: 'eq-phy12-31', title: 'Transistor Current', formula: 'I_E = I_B + I_C' }, { id: 'eq-phy12-32', title: 'Current Gain (β)', formula: 'β = I_C/I_B' } ]}
                    ]},
                    { id: 'chem', name: 'Chemistry', icon: ChemistryIcon, class: 12, chapters: [
                        { id: 'chem12-ch1', title: 'The Solid State', topics: [ { id: 'chem12-ch1-t1', title: 'Crystal Systems' }, { id: 'chem12-ch1-t2', title: 'Unit Cells' }, { id: 'chem12-ch1-t3', title: 'Packing' } ], equations: [ { id: 'eq-chem12-1', title: 'Density of Unit Cell', formula: 'ρ = (Z×M)/(N_A×a³)' } ]},
                        { id: 'chem12-ch2', title: 'Solutions', topics: [ { id: 'chem12-ch2-t1', title: 'Concentration' }, { id: 'chem12-ch2-t2', title: 'Colligative Properties' } ], equations: [ { id: 'eq-chem12-2', title: 'Osmotic Pressure', formula: 'π = CRT' }, { id: 'eq-chem12-3', title: 'Boiling Point Elevation', formula: 'ΔT_b = K_b×m' } ]},
                        { id: 'chem12-ch3', title: 'Electrochemistry', topics: [ { id: 'chem12-ch3-t1', title: 'Galvanic Cells' }, { id: 'chem12-ch3-t2', title: 'Electrolysis' }, { id: 'chem12-ch3-t3', title: 'Corrosion' } ], equations: [ { id: 'eq-chem12-4', title: 'Nernst Equation', formula: 'E = E° - (RT/nF)lnQ' } ]},
                        { id: 'chem12-ch4', title: 'Chemical Kinetics', topics: [ { id: 'chem12-ch4-t1', title: 'Rate Laws' }, { id: 'chem12-ch4-t2', title: 'Reaction Mechanisms' } ], equations: [ { id: 'eq-chem12-5', title: 'Rate Law', formula: 'Rate = k[A]^m[B]^n' } ]},
                        { id: 'chem12-ch5', title: 'Surface Chemistry', topics: [ { id: 'chem12-ch5-t1', title: 'Adsorption' }, { id: 'chem12-ch5-t2', title: 'Catalysis' }, { id: 'chem12-ch5-t3', title: 'Colloids' } ], equations: []},
                        { id: 'chem12-ch6', title: 'General Principles of Isolation of Elements', topics: [ { id: 'chem12-ch6-t1', title: 'Metallurgy' }, { id: 'chem12-ch6-t2', title: 'Extraction Processes' } ], equations: []},
                        { id: 'chem12-ch7', title: 'The p-Block Elements', topics: [ { id: 'chem12-ch7-t1', title: 'Group 15-18 Elements' }, { id: 'chem12-ch7-t2', title: 'Properties' } ], equations: []},
                        { id: 'chem12-ch8', title: 'The d- and f-Block Elements', topics: [ { id: 'chem12-ch8-t1', title: 'Transition Metals' }, { id: 'chem12-ch8-t2', title: 'Lanthanides, Actinides' } ], equations: []},
                        { id: 'chem12-ch9', title: 'Coordination Compounds', topics: [ { id: 'chem12-ch9-t1', title: 'Complex Formation' }, { id: 'chem12-ch9-t2', title: 'Nomenclature' }, { id: 'chem12-ch9-t3', title: 'Bonding' } ], equations: []},
                        { id: 'chem12-ch10', title: 'Haloalkanes and Haloarenes', topics: [ { id: 'chem12-ch10-t1', title: 'Organic Halogen Compounds' } ], equations: []},
                        { id: 'chem12-ch11', title: 'Alcohols, Phenols and Ethers', topics: [ { id: 'chem12-ch11-t1', title: 'Functional Groups' }, { id: 'chem12-ch11-t2', title: 'Reactions' } ], equations: []},
                        { id: 'chem12-ch12', title: 'Aldehydes, Ketones and Carboxylic Acids', topics: [ { id: 'chem12-ch12-t1', title: 'Carbonyl Compounds' } ], equations: []},
                        { id: 'chem12-ch13', title: 'Amines', topics: [ { id: 'chem12-ch13-t1', title: 'Organic Nitrogen Compounds' } ], equations: []},
                        { id: 'chem12-ch14', title: 'Biomolecules', topics: [ { id: 'chem12-ch14-t1', title: 'Carbohydrates, Proteins' }, { id: 'chem12-ch14-t2', title: 'Vitamins, Nucleic Acids' } ], equations: []},
                        { id: 'chem12-ch15', title: 'Polymers', topics: [ { id: 'chem12-ch15-t1', title: 'Addition and Condensation Polymerization' } ], equations: []},
                        { id: 'chem12-ch16', title: 'Chemistry in Everyday Life', topics: [ { id: 'chem12-ch16-t1', title: 'Drugs' }, { id: 'chem12-ch16-t2', title: 'Food Chemistry' }, { id: 'chem12-ch16-t3', title: 'Cleansing Agents' } ], equations: []}
                    ]},
                    { id: 'bio', name: 'Biology', icon: BiologyIcon, class: 12, chapters: [
                        { id: 'bio12-ch1', title: 'Reproduction in Organisms', topics: [ { id: 'bio12-ch1-t1', title: 'Asexual and Sexual Reproduction' } ], equations: []},
                        { id: 'bio12-ch2', title: 'Sexual Reproduction in Flowering Plants', topics: [ { id: 'bio12-ch2-t1', title: 'Pollination' }, { id: 'bio12-ch2-t2', title: 'Fertilization' }, { id: 'bio12-ch2-t3', title: 'Seed Development' } ], equations: []},
                        { id: 'bio12-ch3', title: 'Human Reproduction', topics: [ { id: 'bio12-ch3-t1', title: 'Male and Female Reproductive Systems' } ], equations: []},
                        { id: 'bio12-ch4', title: 'Reproductive Health', topics: [ { id: 'bio12-ch4-t1', title: 'Population Control' }, { id: 'bio12-ch4-t2', title: 'STDs' } ], equations: []},
                        { id: 'bio12-ch5', title: 'Principles of Inheritance and Variation', topics: [ { id: 'bio12-ch5-t1', title: 'Mendel\'s Laws' }, { id: 'bio12-ch5-t2', title: 'Linkage' }, { id: 'bio12-ch5-t3', title: 'Crossing Over' } ], equations: []},
                        { id: 'bio12-ch6', title: 'Molecular Basis of Inheritance', topics: [ { id: 'bio12-ch6-t1', title: 'DNA Structure' }, { id: 'bio12-ch6-t2', title: 'Replication' }, { id: 'bio12-ch6-t3', title: 'Transcription' } ], equations: []},
                        { id: 'bio12-ch7', title: 'Evolution', topics: [ { id: 'bio12-ch7-t1', title: 'Origin of Life' }, { id: 'bio12-ch7-t2', title: 'Natural Selection' }, { id: 'bio12-ch7-t3', title: 'Speciation' } ], equations: [ { id: 'eq-bio12-1', title: 'Hardy-Weinberg Principle', formula: 'p² + 2pq + q² = 1' } ]},
                        { id: 'bio12-ch8', title: 'Human Health and Disease', topics: [ { id: 'bio12-ch8-t1', title: 'Pathogens' }, { id: 'bio12-ch8-t2', title: 'Immunity' }, { id: 'bio12-ch8-t3', title: 'Vaccines' } ], equations: []},
                        { id: 'bio12-ch9', title: 'Strategies for Enhancement in Food Production', topics: [ { id: 'bio12-ch9-t1', title: 'Plant Breeding' }, { id: 'bio12-ch9-t2', title: 'Animal Husbandry' } ], equations: []},
                        { id: 'bio12-ch10', title: 'Microbes in Human Welfare', topics: [ { id: 'bio12-ch10-t1', title: 'Beneficial Microorganisms' } ], equations: []},
                        { id: 'bio12-ch11', title: 'Biotechnology: Principles and Processes', topics: [ { id: 'bio12-ch11-t1', title: 'Genetic Engineering' }, { id: 'bio12-ch11-t2', title: 'PCR' }, { id: 'bio12-ch11-t3', title: 'Cloning' } ], equations: []},
                        { id: 'bio12-ch12', title: 'Biotechnology and its Applications', topics: [ { id: 'bio12-ch12-t1', title: 'GM Crops' }, { id: 'bio12-ch12-t2', title: 'Gene Therapy' } ], equations: []},
                        { id: 'bio12-ch13', title: 'Organisms and Populations', topics: [ { id: 'bio12-ch13-t1', title: 'Population Ecology' }, { id: 'bio12-ch13-t2', title: 'Life Tables' } ], equations: [ { id: 'eq-bio12-2', title: 'Population Growth', formula: 'dN/dt = rN' } ]},
                        { id: 'bio12-ch14', title: 'Ecosystem', topics: [ { id: 'bio12-ch14-t1', title: 'Energy Flow' }, { id: 'bio12-ch14-t2', title: 'Nutrient Cycling' }, { id: 'bio12-ch14-t3', title: 'Productivity' } ], equations: []},
                        { id: 'bio12-ch15', title: 'Biodiversity and Conservation', topics: [ { id: 'bio12-ch15-t1', title: 'Species Diversity' }, { id: 'bio12-ch15-t2', title: 'Conservation Strategies' } ], equations: []},
                        { id: 'bio12-ch16', title: 'Environmental Issues', topics: [ { id: 'bio12-ch16-t1', title: 'Pollution' }, { id: 'bio12-ch16-t2', title: 'Global Warming' }, { id: 'bio12-ch16-t3', title: 'Ozone Depletion' } ], equations: []}
                    ]}
                ]
            }
        };
