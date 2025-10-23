import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useRef and useCallback
import { BackIcon } from '../ui/Icons';
import { getEquationLessonData } from '../../data/equationLessons';

// --- Helper Functions ---
function renderFormula(formula) {
    return formula
        ? formula.replace(/(\d+)/g, (match) => `<sub>${match}</sub>`)
        : '';
}

// --- Modal Component ---
const InfoModal = ({ isOpen, title, content, onClose, onContinue }) => {
    if (!isOpen) return null;

    const handleContinueClick = () => {
        onClose(); // Close the modal first
        if (onContinue) {
            // Use rAF to ensure modal is visually closed before proceeding
            requestAnimationFrame(() => {
                onContinue();
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            {/* Added relative positioning & adjusted padding/shadow based on index.css .card */}
            <div className="modal-content-card bg-white p-6 sm:p-8 rounded-lg border-2 border-text-primary shadow-[4px_4px_0px_#343434] w-full max-w-xl max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative">
                 {/* Ensure button is above content & styled */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition z-10 p-1 rounded-full hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {/* Ensure title doesn't overlap button */}
                <h3 className="text-2xl font-bold text-brand-primary mb-4 pr-10" dangerouslySetInnerHTML={{ __html: title }}></h3>
                {/* Style content based on index.css body/p */}
                <div className="text-base text-text-primary space-y-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }}></div>
                {/* Style button */}
                {onContinue ? (
                     <button onClick={handleContinueClick} className="btn-primary mt-6 w-full justify-center">Got It! Let's Continue</button>
                ) : (
                     <button onClick={onClose} className="btn-primary mt-6 w-full justify-center">Okay</button>
                 )}
            </div>
        </div>
    );
};


// --- Sub-Components for Phases ---

const Phase1Read = ({ lessonData, onAdvance }) => {
    const { phase1_element_roles } = lessonData;
    // Removed conditional useEffect
    if (!phase1_element_roles) {
         console.warn("Phase1Read rendered without phase1_element_roles data.");
         return <div className="text-center text-lg text-gray-500">Loading next step...</div>; // Or null
     }
    return (
        <div className="text-center space-y-6 w-full">
            <h3 className="text-xl font-bold text-brand-primary mb-4">Phase 1: Basic Element/Variable Roles</h3>
            <div className="card p-4 border-2 border-dashed border-brand-primary/50 bg-background-alt">
                <p className="font-semibold text-lg text-text-primary" dangerouslySetInnerHTML={{ __html: phase1_element_roles.prompt || "Let's look at the parts." }}></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {(phase1_element_roles.elements || []).map(el => (
                    <div key={el.symbol} className="card p-4 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-mono font-bold text-brand-secondary">{el.symbol}</span>
                            <span className="text-lg font-bold text-text-primary" dangerouslySetInnerHTML={{ __html: el.analogy || "Analogy" }}></span>
                        </div>
                        <div className="info-container border-l-4 border-brand-secondary bg-background-alt p-3 rounded-r-md mt-2">
                            <p className="text-sm text-text-secondary">{el.role || "Role description."}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={onAdvance} className="btn-primary mt-6 justify-center">
                Test Your Knowledge
            </button>
        </div>
    );
};

// **NEW** DropZone component to manage its own hover state
const DropZone = ({ pair, correctMatches, onDrop }) => {
    const isCorrect = correctMatches.has(pair.symbol);
    // This hook is valid because it's at the top level of a component
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                if (!isCorrect) setIsDraggingOver(true);
                e.dataTransfer.dropEffect = isCorrect ? 'none' : 'move';
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
                onDrop(e, pair.symbol);
                setIsDraggingOver(false);
            }}
            className={`h-14 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                isCorrect
                    ? 'border-brand-success bg-green-50'
                    : isDraggingOver
                    ? 'border-brand-primary bg-blue-50 scale-105'
                    : 'border-brand-secondary/50 hover:bg-gray-100'
            }`}
        >
            {isCorrect
                ? <span className="font-bold text-lg text-brand-success">✅ {pair.symbol} - {correctMatches.get(pair.symbol)}</span>
                : <span className="font-bold text-xl text-text-tertiary/50">{pair.symbol}</span>
            }
        </div>
    );
};


const Phase1Match = ({ lessonData, matchingGame, onDragStart, onDrop }) => {
    const { phase1_element_roles } = lessonData;
    const { options, correctMatches, currentDragItem } = matchingGame;
    // Removed conditional useEffect
     if (!phase1_element_roles) {
         console.warn("Phase1Match rendered without phase1_element_roles data.");
         return <div className="text-center text-lg text-gray-500">Loading next step...</div>;
     }
    const matchingPairs = phase1_element_roles.matching_pairs || [];
    const isComplete = matchingPairs.length > 0 && correctMatches.size === matchingPairs.length;

    return (
         <div className="text-center space-y-6 w-full">
            <h3 className="text-xl font-bold text-brand-primary mb-4">Phase 1: Match the Roles!</h3>
            <div className="card p-4 border-2 border-dashed border-brand-primary/50 bg-background-alt">
                <p className="font-semibold text-lg text-text-primary">{phase1_element_roles.matching_prompt || "Match the items:"}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 w-full">
                {/* Drop Zones - Use the new DropZone component */}
                <div className="flex flex-col gap-4 p-4 card bg-background-alt flex-1">
                    <h4 className="text-lg font-bold text-text-primary mb-2">Symbols/Formulas (Drop Role Here)</h4>
                    {matchingPairs.map(pair => (
                        <DropZone
                            key={pair.symbol}
                            pair={pair}
                            correctMatches={correctMatches}
                            onDrop={onDrop}
                        /> // Valid: No hook inside map
                    ))}
                     {matchingPairs.length === 0 && <p className="text-gray-500 italic">No items to match for this step.</p>}
                </div>

                {/* Drag Options */}
                <div className="flex flex-col gap-4 p-4 card flex-1">
                    <h4 className="text-lg font-bold text-text-primary mb-2">Roles (Drag Me)</h4>
                    {options.map(item => (
                        <div
                            key={item.role_name}
                            draggable={!isComplete}
                            onDragStart={(e) => onDragStart(e, item)}
                            className={`h-14 p-2 rounded-lg flex items-center justify-center font-semibold transition-all ${
                                currentDragItem?.role_name === item.role_name ? 'opacity-50 scale-95' : ''
                                } ${!isComplete ? 'cursor-move bg-brand-primary text-white shadow-md hover:bg-brand-primary/90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        >
                            {item.role_name}
                        </div>
                    ))}
                    {options.length === 0 && !isComplete && matchingPairs.length > 0 && <p className="text-text-secondary">Matching...</p>}
                    {isComplete && <p className="text-brand-success font-semibold">All matched! Moving on...</p>}
                     {matchingPairs.length === 0 && <p className="text-gray-500 italic">No items to match.</p>}
                </div>
            </div>
            {/* Advance button handled by parent */}
        </div>
    );
};


const MoleculeBuilder = ({ phase, stepIndex, steps, currentStep, currentBuild, availableElements, isBuildCorrect, onElementSelect, onCheckBuild }) => {
    // Removed conditional useEffect
    if (!steps || !currentStep) {
         console.warn(`MoleculeBuilder rendered without valid step data for phase ${phase}.`);
         return <div className="text-center text-lg text-gray-500">Loading next step...</div>;
     }

    const isReactantPhase = phase === 2;
    const moleculeFormula = currentStep.molecule_formula || currentStep.product_formula;
    const phaseTitle = isReactantPhase ? "The Ingredients Checklist" : "The Final Meal Assembly";

    return (
         <div className="space-y-6 w-full">
            <h3 className="text-xl font-bold text-brand-primary mb-2 text-center">{phaseTitle}: Step {stepIndex + 1} of {steps.length}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="info-container border-l-4 border-brand-secondary bg-background-alt p-3 rounded-r-md">
                    <p className="font-semibold text-lg text-text-primary mb-1">Building: {currentStep.role_analogy || "Component"}</p>
                    <p className="font-semibold text-lg text-text-primary mt-3 mb-1">Why Needed:</p>
                    <p className="text-sm text-text-secondary">{currentStep.why_and_how_it_works || "Explanation placeholder."}</p>
                </div>
                <div className="deep-why-container bg-orange-50 border-2 border-dashed border-brand-orange p-3 rounded-lg text-sm">
                    <p className="font-semibold text-brand-orange mb-1">Activity Instructions:</p>
                    <p className="text-text-primary">{currentStep.build_prompt || "Select the correct elements/variables."}</p>
                </div>
            </div>

            <div className={`activity-container card`}>
                <h4 className="text-lg font-bold mb-3 text-center">Your Workbench:</h4>
                <div className={`flex flex-col justify-center items-center h-32 w-full bg-background-page rounded-lg p-4 border-2 border-dashed border-border transition-all`}>
                    {isBuildCorrect ? (
                        <span className="text-4xl font-bold text-brand-success">✅ <span dangerouslySetInnerHTML={{ __html: renderFormula(moleculeFormula) }}></span></span>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-3 font-mono text-xl">
                            {Object.keys(currentBuild).length === 0 ?
                                <span className="text-text-tertiary">Select blocks below...</span> :
                                Object.entries(currentBuild).map(([symbol, count]) => (
                                    <span key={symbol} className="inline-flex items-center px-3 py-1 border border-brand-primary/50 bg-white rounded-full text-text-primary">
                                        {symbol} x {count}
                                    </span>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableElements.map(el => (
                    <div key={el.symbol} className="card p-3 text-center">
                        <p className="text-xl font-bold">{el.symbol}</p>
                        <p className="text-xs text-text-secondary">{el.intuitive_name}</p>
                        <div className="flex justify-center gap-2 mt-2">
                            <button onClick={() => onElementSelect(el.symbol, 1)} disabled={isBuildCorrect} className="btn-primary text-sm py-1 px-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"> Add </button>
                            <button onClick={() => onElementSelect(el.symbol, -1)} disabled={isBuildCorrect || !currentBuild[el.symbol]} className={`btn-primary text-sm py-1 px-3 justify-center bg-red-600 border-red-800 shadow-red-800 hover:bg-red-700 disabled:bg-red-300 disabled:border-red-500 disabled:shadow-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}> Remove </button>
                        </div>
                    </div>
                ))}
                 {availableElements.length === 0 && <p className="text-text-tertiary italic col-span-full text-center">No elements defined for building.</p>}
            </div>

            <div className="mt-6 text-center">
                {isBuildCorrect ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-800">
                            {isReactantPhase ? `Sahi Jawab! You built one ${renderFormula(moleculeFormula)}. We need ${currentStep.coefficient || 1} of these!` : `Perfect! That's one of the final products: ${renderFormula(moleculeFormula)}.`}
                        </p>
                         <button onClick={onCheckBuild} className="btn-primary mt-4 justify-center"> {phase === 3 && stepIndex === steps.length - 1 ? "View Final Recipe" : `Continue`} </button>
                    </div>
                ) : (
                    <button onClick={onCheckBuild} disabled={Object.keys(currentBuild).length === 0 && !!currentStep.correct_build && currentStep.correct_build.length > 0} className="btn-primary bg-brand-orange border-orange-700 shadow-orange-700 hover:bg-orange-600 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"> {(!currentStep.correct_build || currentStep.correct_build.length === 0) ? "Continue" : "Check My Blocks"} </button>
                )}
            </div>
        </div>
    );
};

const FinalEquationDisplay = ({ lessonData, onAdvance }) => {
    const { phase3_product_build } = lessonData;
    // Removed conditional useEffect
     if (!phase3_product_build) {
         console.warn("FinalEquationDisplay rendered without phase3_product_build data.");
         return <div className="text-center text-lg text-gray-500">Loading summary...</div>;
     }
    return (
        <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-brand-primary mb-4">The Complete Recipe!</h3>
             <div className="card p-4 border-2 border-dashed border-brand-primary/50 bg-background-alt mb-6">
                 <p className="font-semibold text-lg text-text-primary mb-2">Reaction Workflow Story:</p>
                 <p className="text-md text-text-secondary">{phase3_product_build.final_story_workflow || "The reaction is complete."}</p>
             </div>
             <p className="text-lg mb-6 text-text-secondary"> Here is the full balanced equation: </p>
             <div className="flex justify-center items-center gap-2 bg-gray-100 p-4 rounded-lg mb-8 flex-wrap border border-gray-300">
                 {(phase3_product_build.final_equation_display || []).map((component, index) => (
                     <div key={index} className={`text-2xl font-bold font-mono p-1 ${component.type === 'operator' ? 'text-text-secondary' : 'text-text-primary'}`} dangerouslySetInnerHTML={{ __html: component.value.length > 1 ? renderFormula(component.value) : component.value }}></div>
                 ))}
                  {(phase3_product_build.final_equation_display || []).length === 0 && <p className="italic text-gray-500">Equation display data missing.</p>}
             </div>
             <button onClick={onAdvance} className="btn-primary justify-center"> View Summary and Finish Lesson </button>
        </div>
    );
};

const CompletionScreen = ({ lessonData, onExit }) => {
    const { summary, equation } = lessonData;
    return (
        <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-brand-primary mb-2">{summary?.title || "Lesson Complete!"} 🎉</h2>
            <p className="text-lg mb-6 text-text-secondary">{summary?.text || "Great job completing the lesson!"}</p>
            <div className="text-3xl sm:text-4xl font-mono text-center py-4 px-2 bg-green-50 text-brand-success rounded-lg mb-6 border-2 border-brand-success" dangerouslySetInnerHTML={{ __html: renderFormula(equation?.formula) }}></div>
            <button onClick={onExit} className="btn-primary justify-center">Back to Subject</button>
        </div>
    );
};


// --- Main Equation Tutor Component (Logic Part) ---
const EquationTutor = ({ equation, chapterTitle, user, onExit }) => {
    // --- State ---
    const [lessonData, setLessonData] = useState(null);
    const [isLoadingLesson, setIsLoadingLesson] = useState(true);
    const [errorLoadingLesson, setErrorLoadingLesson] = useState(null);
    const [phase, setPhase] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [currentBuild, setCurrentBuild] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const [nextAction, setNextAction] = useState(null);
    const [initialModalShown, setInitialModalShown] = useState(false);
    const [matchingGame, setMatchingGame] = useState({
        options: [],
        correctMatches: new Map(),
        currentDragItem: null,
    });
    const contentRef = useRef(null);

    // --- Load Hardcoded Lesson Data ---
    useEffect(() => {
        setIsLoadingLesson(true);
        setErrorLoadingLesson(null);
        setInitialModalShown(false);
        setPhase(0);
        console.log(`Loading lesson for ID: ${equation.id}`);

        let lesson = null;
        try {
            lesson = getEquationLessonData(equation.id);
        } catch (e) {
            console.error("Error retrieving lesson data:", e);
            setErrorLoadingLesson("Internal error loading lesson data.");
            setIsLoadingLesson(false);
            return;
        }


        if (lesson) {
            console.log("Lesson data found:", lesson);
            setLessonData(lesson);
            const hasPhase1 = !!lesson.phase1_element_roles?.elements?.length;
            const hasPhase2 = !!lesson.phase2_reactant_build?.steps?.length;
            const hasPhase3 = !!lesson.phase3_product_build && (!!lesson.phase3_product_build.products?.length || !!lesson.phase3_product_build.final_equation_display);
            const startPhase = hasPhase1 ? 1.0 : (hasPhase2 ? 2 : (hasPhase3 ? 4 : 5));

            console.log("Setting start phase to:", startPhase);
            setPhase(startPhase);

            if (startPhase <= 1.1 && lesson.phase1_element_roles?.matching_pairs) {
                 setMatchingGame({
                     options: lesson.phase1_element_roles.matching_pairs
                         .map(p => ({ ...p, isMatched: false, isOption: true }))
                         .sort(() => Math.random() - 0.5),
                     correctMatches: new Map(),
                     currentDragItem: null
                 });
             } else {
                 setMatchingGame({ options: [], correctMatches: new Map(), currentDragItem: null });
             }
             setStepIndex(0);
             setCurrentBuild({});
             setIsLoadingLesson(false);
        } else {
            console.error("Error: Lesson data not found for equation ID:", equation.id);
            setErrorLoadingLesson(`Lesson data not found for "${equation.title}". Please add it to equationLessons.js.`);
            setIsLoadingLesson(false);
        }
    }, [equation]);


    // --- Modal Logic ---
    const showModal = (title, content, onContinueCallback) => {
        if (isModalOpen || errorLoadingLesson || isLoadingLesson) return;
        setModalContent({ title, content });
        setNextAction(onContinueCallback ? () => onContinueCallback : null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
         setIsModalOpen(false);
        if (nextAction) {
             requestAnimationFrame(() => {
                nextAction();
                setNextAction(null);
             });
        }
    };

    // --- Phase Advancement (Memoized) ---
    const advancePhase = useCallback(() => {
         if (!lessonData || isLoadingLesson) return; // Don't advance if no data or still loading

        let nextPhase = phase;
        let nextStepIndex = stepIndex;
        let modalToShow = null;
        let shouldAdvance = true;

        const hasPhase1Roles = !!lessonData.phase1_element_roles?.elements?.length;
        const hasPhase1Match = hasPhase1Roles && !!lessonData.phase1_element_roles?.matching_pairs?.length;
        const hasPhase2Build = !!lessonData.phase2_reactant_build?.steps?.length;
        const hasPhase3Build = !!lessonData.phase3_product_build?.products?.length;
        const hasPhase3Display = !!lessonData.phase3_product_build?.final_equation_display;

        console.log(`Advancing from phase ${phase}, step ${stepIndex}`);

        if (phase === 1.0) { nextPhase = hasPhase1Match ? 1.1 : (hasPhase2Build ? 2 : (hasPhase3Display ? 4 : 5)); }
        else if (phase === 1.1) { nextPhase = hasPhase2Build ? 2 : (hasPhase3Display ? 4 : 5); }
        else if (phase === 2) {
            const numReactantSteps = lessonData.phase2_reactant_build?.steps?.length || 0;
            if (stepIndex < numReactantSteps - 1) { nextStepIndex++; setCurrentBuild({}); }
            else { nextPhase = hasPhase3Build ? 3 : (hasPhase3Display ? 4 : 5); nextStepIndex = 0; setCurrentBuild({}); }
        } else if (phase === 3) {
            const numProductSteps = lessonData.phase3_product_build?.products?.length || 0;
             if (stepIndex < numProductSteps - 1) { nextStepIndex++; setCurrentBuild({}); }
             else { nextPhase = hasPhase3Display ? 4 : 5; nextStepIndex = 0; }
        } else if (phase === 4) { nextPhase = 5; nextStepIndex = 0; }
        else { shouldAdvance = false; }

        if(shouldAdvance) {
            setPhase(nextPhase);
            setStepIndex(nextStepIndex);
             // Handle intro modals for new phases
             if (nextPhase === 2 && phase < 2) { // Just entered phase 2
                  const firstStep = lessonData.phase2_reactant_build?.steps?.[0];
                  if(firstStep?.modal_detail) { modalToShow = { title: `Phase 2: Gathering Ingredients!`, content: `<p>...Pehle ${firstStep.modal_detail.title} molecule banana seekhte hain.</p><hr class='my-3'/>${firstStep.modal_detail.content}`, onContinue: null }; }
            } else if (nextPhase === 3 && phase < 3) { // Just entered phase 3
                 const firstProdStep = lessonData.phase3_product_build?.products?.[0];
                 if(firstProdStep?.modal_detail) { modalToShow = { title: `Phase 3: Making the Products!`, content: `<p>Raw materials ready! First up, ${firstProdStep.modal_detail.title}!</p><hr class='my-3'/>${firstProdStep.modal_detail.content}`, onContinue: null }; }
            } else if (nextPhase === 4 && phase < 4) { // Just entered phase 4
                 modalToShow = { title: `Awesome! Products Ready!`, content: `<p>Time hai poori kahani ko ek saath dekhne ka (The Final Equation).</p>`, onContinue: null };
            } // etc.

             if (modalToShow) { showModal(modalToShow.title, modalToShow.content, modalToShow.onContinue); }
             console.log(`Advanced TO phase ${nextPhase}, step ${nextStepIndex}`);
        }
    // We must memoize this function to safely use it in the useEffect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, stepIndex, lessonData, isLoadingLesson]);

    // --- Top-level Effect for Initial Modal & Skipping Empty Phases ---
    useEffect(() => {
        if (isLoadingLesson || !lessonData) return; // Wait for data

        // 1. Show initial modal if conditions are met
        if (phase === 1.0 && !initialModalShown && !isModalOpen) {
             const modalTitle = `Welcome to the ${lessonData.equation.title} Lab!`;
             const modalContent = `<p>Namaste, bhaiyya! Hum ${lessonData.equation.title} ki recipe banane wale hain... All the best!</p><p class='mt-2 italic text-sm'>(${lessonData.analogy || 'Lets start!'})</p>`;
             setInitialModalShown(true);
             showModal(modalTitle, modalContent, null);
             return; // Don't try to skip phase on the same render
         }

        // 2. Check if the *current* phase is empty and needs skipping
        let phaseIsEmtpy = false;
        if (phase === 1.0 && (!lessonData.phase1_element_roles?.elements || lessonData.phase1_element_roles.elements.length === 0)) {
            console.log("Skipping Phase 1.0 (no roles)");
            phaseIsEmtpy = true;
        } else if (phase === 1.1 && (!lessonData.phase1_element_roles?.matching_pairs || lessonData.phase1_element_roles.matching_pairs.length === 0)) {
            console.log("Skipping Phase 1.1 (no match)");
            phaseIsEmtpy = true;
        } else if (phase === 2 && (!lessonData.phase2_reactant_build?.steps || lessonData.phase2_reactant_build.steps.length === 0)) {
            console.log("Skipping Phase 2 (no reactant steps)");
            phaseIsEmtpy = true;
        } else if (phase === 3 && (!lessonData.phase3_product_build?.products || lessonData.phase3_product_build.products.length === 0)) {
            console.log("Skipping Phase 3 (no product steps)");
            phaseIsEmtpy = true;
        } else if (phase === 4 && !lessonData.phase3_product_build?.final_equation_display) {
            console.log("Skipping Phase 4 (no final display)");
            phaseIsEmtpy = true;
        }

        if (phaseIsEmtpy) {
            advancePhase(); // Call advancePhase to move to the *next* valid phase
        }
    
    }, [phase, lessonData, isLoadingLesson, isModalOpen, initialModalShown, advancePhase]); // `advancePhase` is now a dependency


    // --- Build Logic ---
     const checkBuildMatch = (step) => {
        if (!step || !lessonData) return false;
        const correctBuildData = step.correct_build;
        if (!correctBuildData || correctBuildData.length === 0) return true;
        const requiredElements = correctBuildData.reduce((acc, item) => { acc[item.symbol] = (acc[item.symbol] || 0) + item.count; return acc; }, {});
        const requiredKeys = Object.keys(requiredElements);
        if (requiredKeys.length === 0) return true;
        return requiredKeys.every(symbol => currentBuild[symbol] === requiredElements[symbol]);
     };

    // --- Event Handlers ---
    const triggerShake = () => {
        if (contentRef.current) {
            contentRef.current.classList.remove('animate-shake');
            void contentRef.current.offsetWidth; // Force reflow
            contentRef.current.classList.add('animate-shake');
            setTimeout(() => { if (contentRef.current) contentRef.current.classList.remove('animate-shake'); }, 500);
        }
    };
    const handleElementSelect = (symbol, count) => {
        if (!lessonData) return;
        const steps = phase === 2 ? lessonData.phase2_reactant_build?.steps : lessonData.phase3_product_build?.products;
        const currentStep = steps?.[stepIndex];
        if (!currentStep || checkBuildMatch(currentStep)) return;
        const newCount = (currentBuild[symbol] || 0) + count;
        if (newCount < 0) return;
        setCurrentBuild(prevBuild => {
            const newBuild = { ...prevBuild };
            if (newCount > 0) newBuild[symbol] = newCount;
            else delete newBuild[symbol];
            return newBuild;
        });
     };
    const handleCheckBuild = () => {
        if (!lessonData) return;
        const steps = phase === 2 ? lessonData.phase2_reactant_build?.steps : lessonData.phase3_product_build?.products;
        const currentStep = steps?.[stepIndex];
        if (!currentStep) { advancePhase(); return; } // Should not happen, but safe
        if (!currentStep.correct_build || currentStep.correct_build.length === 0) { advancePhase(); return; }
        if (Object.keys(currentBuild).length === 0) { triggerShake(); return; }
        if (!checkBuildMatch(currentStep)) { triggerShake(); }
        else { advancePhase(); }
     };
    const handleDragStart = (e, item) => {
        if (phase !== 1.1) return;
        setMatchingGame(prev => ({ ...prev, currentDragItem: item }));
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.symbol);
     };
    const handleDrop = (e, targetSymbol) => {
        e.preventDefault();
        if (phase !== 1.1 || !lessonData || !lessonData.phase1_element_roles) return;
        const item = matchingGame.currentDragItem;
        const matchingPairs = lessonData.phase1_element_roles.matching_pairs || [];
        if (!item || matchingGame.correctMatches.has(targetSymbol)) return;
        if (item.symbol === targetSymbol) {
            const matchFound = matchingPairs.find(p => p.symbol === targetSymbol);
             if (!matchFound) return;
            const newCorrectMatches = new Map(matchingGame.correctMatches);
            newCorrectMatches.set(targetSymbol, matchFound.role_name);
            const updatedOptions = matchingGame.options.filter(opt => opt.symbol !== item.symbol);
            setMatchingGame(prev => ({ ...prev, correctMatches: newCorrectMatches, options: updatedOptions, currentDragItem: null }));
            if (newCorrectMatches.size === matchingPairs.length) { advancePhase(); }
        } else { triggerShake(); }
     };

    // --- Render Logic ---
    const renderContent = () => {
        // Removed conditional useEffect calls
        if (isLoadingLesson) { return ( <div className="text-center space-y-4"> {/* ... loading spinner ... */} </div> ); }
        if (errorLoadingLesson) { return ( <div className="text-center text-red-600"> {/* ... error message ... */} </div> ); }
        if (!lessonData) { return <div className="text-center text-lg text-gray-500">Preparing lesson...</div>; }
        if (phase === 1.0 && !initialModalShown && !isModalOpen) { return <div className="text-center text-lg text-gray-500">Getting started...</div>; }
        
        // Render based on current phase
        switch (phase) {
            case 1.0: return <Phase1Read lessonData={lessonData} onAdvance={advancePhase} />;
            case 1.1: return <Phase1Match lessonData={lessonData} matchingGame={matchingGame} onDragStart={handleDragStart} onDrop={handleDrop} />;
            case 2:
            case 3:
                const steps = phase === 2 ? lessonData.phase2_reactant_build?.steps : lessonData.phase3_product_build?.products;
                 // This check is fine, it just renders null/loading if data isn't ready for this phase
                 // The top-level useEffect will handle advancing the phase if it's stuck here
                if (!steps || steps.length === 0) {
                     return <div>Loading next phase...</div>;
                 }
                const currentStep = steps?.[stepIndex];
                if (!currentStep) {
                     return <div>Loading next step...</div>;
                 }
                const availableElements = (lessonData.concepts || []).filter(c => c.type === 'element' || c.type === 'variable');
                return (
                    <MoleculeBuilder
                        phase={phase} stepIndex={stepIndex} steps={steps}
                        currentStep={currentStep} currentBuild={currentBuild}
                        availableElements={availableElements}
                        isBuildCorrect={checkBuildMatch(currentStep)}
                        // Pass triggerShake function, not state
                        shake={false} // Shake is handled by ref
                        onElementSelect={handleElementSelect}
                        onCheckBuild={handleCheckBuild}
                    />
                );
            case 4: return <FinalEquationDisplay lessonData={lessonData} onAdvance={advancePhase} />;
            case 5: return <CompletionScreen lessonData={lessonData} onExit={onExit} />;
            default: return <div>Loading Phase {phase}...</div>;
        }
    };

    // --- JSX ---
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
                <div className="card mb-4 sm:mb-0">
                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-text-primary">{equation.title}</h1>
                    <p className="text-sm sm:text-base text-text-secondary">From Chapter: <span className="font-semibold text-brand-primary">{chapterTitle}</span></p>
                </div>
                <button onClick={onExit} className="btn-primary text-sm sm:text-base">
                    <BackIcon /> Back to Subject
                </button>
            </div>

            {/* Main Content Area - Apply ref here */}
            <div ref={contentRef} key={equation.id} className={`card min-h-[500px] flex items-start justify-center transition-transform duration-500`}>
                 <div className="w-full">
                    {renderContent()}
                 </div>
            </div>

             {/* Modal */}
             <InfoModal
                 isOpen={isModalOpen}
                 title={modalContent.title}
                 content={modalContent.content}
                 onClose={closeModal}
                 onContinue={nextAction ? closeModal : null}
             />
        </div>
    );
};


export default EquationTutor;