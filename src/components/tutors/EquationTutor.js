import React, { useState, useEffect } from 'react';
import { BackIcon } from '../ui/Icons'; // Assuming BackIcon is sufficient, add others if needed
import { callEquationLessonGeneratorAPI } from '../../utils/aiService'; // Import the new generator

// --- Helper Functions ---
function renderFormula(formula) {
    // Simple replacement for basic subscript numbers
    // Extend this if more complex formulas are needed
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
            <div className="modal-content-card w-full max-w-xl max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative"> {/* Added relative positioning */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition z-10"> {/* Ensure button is above content */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {/* Ensure title doesn't overlap button */}
                <h3 className="text-2xl font-bold text-[#4A694E] mb-4 pr-10" dangerouslySetInnerHTML={{ __html: title }}></h3>
                <div className="text-base text-[#343434] space-y-4" dangerouslySetInnerHTML={{ __html: content }}></div>
                {/* Conditionally render continue button only if onContinue is provided */}
                {onContinue ? (
                     <button onClick={handleContinueClick} className="btn-primary mt-6 w-full">Got It! Let's Continue</button>
                ) : (
                     <button onClick={onClose} className="btn-primary mt-6 w-full">Okay</button>
                 )}
            </div>
        </div>
    );
};


// --- Sub-Components for Phases ---

const Phase1Read = ({ lessonData, onAdvance }) => {
    const { phase1_element_roles } = lessonData;
    return (
        <div className="text-center space-y-6 w-full">
            <h3 className="text-xl font-bold text-[#4A694E] mb-4">Phase 1: Basic Element Roles</h3>
            <div className="p-4 border-2 border-dashed border-[#4A694E]/50 bg-white rounded-lg">
                <p className="font-semibold text-lg" dangerouslySetInnerHTML={{ __html: phase1_element_roles.prompt }}></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {phase1_element_roles.elements.map(el => (
                    <div key={el.symbol} className="card p-4 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-mono font-bold text-[#8B6F4E]">{el.symbol}</span>
                            <span className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: el.analogy }}></span>
                        </div>
                        <div className="info-container"> {/* Assuming .info-container style exists */}
                            <p className="text-sm text-[#343434]">{el.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={onAdvance} className="btn-primary mt-6">
                Test Your Knowledge
            </button>
        </div>
    );
};

const Phase1Match = ({ lessonData, matchingGame, onDragStart, onDrop }) => {
    const { phase1_element_roles } = lessonData;
    const { options, correctMatches } = matchingGame;
    const isComplete = correctMatches.size === phase1_element_roles.matching_pairs.length;

    return (
         <div className="text-center space-y-6 w-full">
            <h3 className="text-xl font-bold text-[#4A694E] mb-4">Phase 1: Match the Roles!</h3>
            <div className="p-4 border-2 border-dashed border-[#4A694E]/50 bg-white rounded-lg">
                <p className="font-semibold text-lg">{phase1_element_roles.matching_prompt}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 w-full">
                {/* Drop Zones */}
                <div className="flex flex-col gap-4 p-4 card bg-[#eaddc7] flex-1">
                    <h4 className="text-lg font-bold text-[#343434] mb-2">Element Symbols (Drop Role Here)</h4>
                    {phase1_element_roles.matching_pairs.map(pair => (
                        <div
                            key={pair.symbol}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => onDrop(e, pair.symbol)}
                            className={`h-12 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                                correctMatches.has(pair.symbol)
                                  ? 'border-[#38A169] bg-green-100' // success color
                                  : 'border-[#8B6F4E]/50 hover:bg-gray-100' // secondary/alt color
                            }`}
                        >
                            {correctMatches.has(pair.symbol)
                              ? <span className="font-bold text-lg text-[#38A169]">✅ {pair.symbol} - {correctMatches.get(pair.symbol)}</span>
                              : <span className="font-bold text-xl text-[#9E9E9E]/50">{pair.symbol}</span> // tertiary color
                            }
                        </div>
                    ))}
                </div>

                {/* Drag Options */}
                <div className="flex flex-col gap-4 p-4 activity-container flex-1"> {/* Assuming .activity-container exists */}
                    <h4 className="text-lg font-bold text-[#343434] mb-2">Roles (Drag Me)</h4>
                    {options.map(item => (
                        <div
                            key={item.role_name}
                            draggable={!isComplete}
                            onDragStart={(e) => onDragStart(e, item)}
                            className={`h-12 p-2 rounded-lg flex items-center justify-center font-semibold ${!isComplete ? 'cursor-move bg-[#4A694E] text-white shadow-md hover:bg-[#3E5842]' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        >
                            {item.role_name}
                        </div>
                    ))}
                    {options.length === 0 && !isComplete && <p className="text-[#6B6B6B]">Matching...</p>}
                    {isComplete && <p className="text-[#38A169] font-semibold">All matched! Moving on...</p>}
                </div>
            </div>
            {/* The button to advance is now handled by the parent component's modal logic after completion */}
        </div>
    );
};


const MoleculeBuilder = ({ phase, stepIndex, steps, currentStep, currentBuild, availableElements, isBuildCorrect, shake, onElementSelect, onCheckBuild }) => {
    const isReactantPhase = phase === 2;
    const moleculeFormula = currentStep.molecule_formula || currentStep.product_formula;
    const phaseTitle = isReactantPhase ? "The Ingredients Checklist" : "The Final Meal Assembly";

    return (
         <div className="space-y-6 w-full">
            <h3 className="text-xl font-bold text-[#4A694E] mb-2 text-center">{phaseTitle}: Step {stepIndex + 1} of {steps.length}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Assuming .info-container style exists */}
                <div className="info-container">
                    <p className="font-semibold text-lg mb-1">Building: {currentStep.role_analogy}</p>
                    <p className="font-semibold text-lg mt-3 mb-1">Why Needed:</p>
                    <p className="text-sm text-[#6B6B6B]">{currentStep.why_and_how_it_works}</p>
                </div>
                 {/* Assuming .deep-why-container style exists */}
                <div className="deep-why-container">
                    <p className="font-semibold text-[#DD6B20] mb-1">Activity Instructions:</p>
                    <p className="text-sm text-[#343434]">{currentStep.build_prompt}</p>
                </div>
            </div>

            {/* Assuming .activity-container exists */}
            <div className={`activity-container text-center ${shake ? 'animate-shake' : ''}`}>
                <h4 className="text-lg font-bold mb-3">Your Workbench:</h4>
                <div className={`flex flex-col justify-center items-center h-32 w-full bg-[#f7f5f2] rounded-lg p-4 border-2 border-dashed border-[#EDEAE6] transition-all`}>
                    {isBuildCorrect ? (
                        <span className="text-4xl font-bold text-[#38A169]">✅ <span dangerouslySetInnerHTML={{ __html: renderFormula(moleculeFormula) }}></span></span>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-3 font-mono text-xl">
                            {Object.keys(currentBuild).length === 0 ?
                                <span className="text-[#9E9E9E]">Select element blocks below...</span> :
                                Object.entries(currentBuild).map(([symbol, count]) => (
                                    <span key={symbol} className="inline-flex items-center px-3 py-1 border border-[#4A694E]/50 bg-white rounded-full">
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
                        <p className="text-xs text-[#6B6B6B]">{el.intuitive_name}</p>
                        <div className="flex justify-center gap-2 mt-2">
                            <button
                                onClick={() => onElementSelect(el.symbol, 1)}
                                disabled={isBuildCorrect}
                                className="btn-primary text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            > Add </button>
                             <button
                                onClick={() => onElementSelect(el.symbol, -1)}
                                disabled={isBuildCorrect || !currentBuild[el.symbol]}
                                className={`btn-primary text-sm py-1 px-3 bg-red-600 border-red-800 shadow-red-800 hover:bg-red-700 disabled:bg-red-300 disabled:border-red-500 disabled:shadow-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                            > Remove </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                {isBuildCorrect ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-800">
                            {isReactantPhase ?
                                `Sahi Jawab! You built one ${renderFormula(moleculeFormula)}. We need ${currentStep.coefficient} of these!` :
                                `Perfect! That's one of the final products: ${renderFormula(moleculeFormula)}.`
                            }
                        </p>
                         {/* This button now directly calls the passed onCheckBuild (which handles advance) */}
                         <button onClick={onCheckBuild} className="btn-primary mt-4">
                             {phase === 3 && stepIndex === steps.length - 1 ? "View Final Recipe" : `Continue`}
                         </button>
                    </div>
                ) : (
                    <button
                        onClick={onCheckBuild} // Calls the handler for checking/shaking/advancing
                        disabled={Object.keys(currentBuild).length === 0}
                        className="btn-primary bg-[#DD6B20] border-[#b05619] shadow-[#b05619] hover:bg-[#c25d1b] w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check My Blocks
                    </button>
                )}
            </div>
        </div>
    );
};

const FinalEquationDisplay = ({ lessonData, onAdvance }) => {
    const { phase3_product_build } = lessonData;
    return (
        <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-[#4A694E] mb-4">The Complete Recipe is Ready!</h3>
             <div className="p-4 border-2 border-dashed border-[#4A694E]/50 bg-white rounded-lg mb-6">
                 <p className="font-semibold text-lg mb-2">Reaction Workflow Story:</p>
                 <p className="text-md text-[#6B6B6B]">{phase3_product_build.final_story_workflow}</p>
             </div>
             <p className="text-lg mb-6 text-[#6B6B6B]">
                 You successfully built the whole reaction from scratch! Here is the full balanced equation:
             </p>
             <div className="flex justify-center items-center gap-2 bg-gray-100 p-4 rounded-lg mb-8 flex-wrap">
                 {phase3_product_build.final_equation_display.map((component, index) => (
                     <div key={index} className={`text-2xl font-bold font-mono p-1 ${component.type === 'operator' ? 'text-[#6B6B6B]' : 'text-[#343434]'}`}
                          dangerouslySetInnerHTML={{ __html: component.value.length > 1 ? renderFormula(component.value) : component.value }}>
                     </div>
                 ))}
             </div>
             <button onClick={onAdvance} className="btn-primary">
                 View Summary and Finish Lesson
             </button>
        </div>
    );
};

const CompletionScreen = ({ lessonData, onExit }) => {
    const { summary, equation } = lessonData;
    return (
        <div className="text-center w-full">
            <h2 className="text-2xl font-bold mb-2">{summary.title}</h2>
            <p className="text-lg mb-6 text-[#6B6B6B]">{summary.text}</p>
            <div className="text-4xl font-mono text-center py-4 px-2 bg-[#38A169]/20 text-[#4A694E] rounded-lg mb-6 border border-[#38A169]"
                 dangerouslySetInnerHTML={{ __html: renderFormula(equation.formula) }}>
            </div>
            <button onClick={onExit} className="btn-primary">Lesson Complete! Back to Subject</button>
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
    const [shake, setShake] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const [nextAction, setNextAction] = useState(null);
    const [initialModalShown, setInitialModalShown] = useState(false);
    const [matchingGame, setMatchingGame] = useState({
        options: [],
        correctMatches: new Map(),
        currentDragItem: null,
    });

    // --- Fetch Lesson Data ---
    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoadingLesson(true);
            setErrorLoadingLesson(null);
            setInitialModalShown(false); // Reset initial modal flag on new equation
            try {
                const generatedLesson = await callEquationLessonGeneratorAPI(equation, user);
                if (generatedLesson && generatedLesson.equation) {
                    setLessonData(generatedLesson);
                    setPhase(1.0);
                    if (generatedLesson.phase1_element_roles?.matching_pairs) {
                        setMatchingGame({ // Reset matching game state fully
                            options: generatedLesson.phase1_element_roles.matching_pairs
                                .map(p => ({ ...p, isMatched: false, isOption: true }))
                                .sort(() => Math.random() - 0.5),
                            correctMatches: new Map(),
                            currentDragItem: null
                        });
                    }
                     setStepIndex(0); // Reset step index
                     setCurrentBuild({}); // Reset current build
                } else {
                    throw new Error("Failed to generate a valid lesson plan.");
                }
            } catch (err) {
                console.error("Error fetching lesson:", err);
                setErrorLoadingLesson(err.message || "Could not load lesson. Please try again.");
                setPhase(0);
            } finally {
                setIsLoadingLesson(false);
            }
        };

        if (equation && user) {
            fetchLesson();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equation, user]);


    // --- Modal Logic ---
    const showModal = (title, content, onContinueCallback) => {
        if (isModalOpen || errorLoadingLesson || isLoadingLesson) return;
        setModalContent({ title, content });
        // Ensure the callback is wrapped in a function if it's not null
        setNextAction(onContinueCallback ? () => onContinueCallback : null);
        setIsModalOpen(true);
    };

     const closeModal = () => {
        setIsModalOpen(false);
        // Execute the stored callback when closing, if it exists
        if (nextAction) {
             // Use rAF to ensure modal is visually closed before proceeding
             requestAnimationFrame(() => {
                nextAction(); // Execute the stored function
                setNextAction(null); // Clear the action after execution
             });
        }
    };

    // --- Initial Modal ---
     useEffect(() => {
         // Only show initial modal if data is loaded, no error, phase is 1.0, and not already shown
        if (phase === 1.0 && lessonData && !initialModalShown && !isLoadingLesson && !errorLoadingLesson && !isModalOpen) {
             const modalTitle = `Welcome to the ${lessonData.equation.title} Lab!`;
             const modalContent = `<p>Namaste, bhaiyya! Hum ${lessonData.equation.title} ki recipe banane wale hain. Is reaction ko complete karne ke liye hum kuch phases se gujrenge. Pehla phase hai sabhi elements/parts ka role samajhna. Go through the roles and click 'Test Your Knowledge' to continue. All the best!</p><p class='mt-2 italic text-sm'>(${lessonData.analogy})</p>`;
             setInitialModalShown(true);
             // Show intro modal, pass null because closing it doesn't advance the phase.
             showModal(modalTitle, modalContent, null);
         }
     // Only re-run if these specific states change
     }, [phase, lessonData, initialModalShown, isLoadingLesson, errorLoadingLesson, isModalOpen]);


    // --- Phase Advancement (Includes Modal Triggers) ---
    const advancePhase = () => {
        console.log(`Advancing from phase ${phase}, step ${stepIndex}`);
        let nextPhase = phase;
        let nextStepIndex = stepIndex;
        let modalToShow = null;

        if (phase === 1.0) { nextPhase = 1.1; }
        else if (phase === 1.1) {
            nextPhase = 2; nextStepIndex = 0; setCurrentBuild({});
             // Show modal for start of phase 2
             if (lessonData?.phase2_reactant_build?.steps?.[0]?.modal_detail) {
                 const firstStep = lessonData.phase2_reactant_build.steps[0];
                 modalToShow = {
                     title: `Phase 2: Gathering Ingredients!`,
                     content: `<p>Bhaiyya, ${lessonData.equation.title} ke liye **raw material** chahiye. Hum ${lessonData.phase2_reactant_build.steps.map(s => s.role_analogy).join(' aur ')} ko combine karenge. Pehle ${firstStep.modal_detail.title} molecule banana seekhte hain.</p><hr class='my-3 border-[#8B6F4E]'/><p class='font-semibold'>Detail:</p>${firstStep.modal_detail.content}`,
                     onContinue: null
                 };
             }
        } else if (phase === 2) {
            if (stepIndex < lessonData.phase2_reactant_build.steps.length - 1) {
                nextStepIndex++; setCurrentBuild({});
                 // Show modal for next reactant
                 const nextStep = lessonData.phase2_reactant_build.steps[nextStepIndex];
                 if (nextStep?.modal_detail) {
                     modalToShow = {
                         title: `Next Ingredient: ${nextStep.modal_detail.title}`,
                         content: nextStep.modal_detail.content,
                         onContinue: null
                     };
                 }
            } else {
                nextPhase = 3; nextStepIndex = 0; setCurrentBuild({});
                 // Show modal for start of phase 3
                 if (lessonData?.phase3_product_build?.products?.[0]?.modal_detail) {
                     const firstProdStep = lessonData.phase3_product_build.products[0];
                     modalToShow = {
                         title: `Phase 3: Making the Products!`,
                         content: `<p>Bhaiyya, ab humne saare raw materials (reactants) bana liye! Ab time hai inko milakar **final product** banane ka. Ready ho jao for Phase 3! First up, ${firstProdStep.modal_detail.title}!</p><hr class='my-3 border-[#8B6F4E]'/><p class='font-semibold'>Detail:</p>${firstProdStep.modal_detail.content}`,
                         onContinue: null
                     };
                 }
            }
        } else if (phase === 3) {
            if (stepIndex < lessonData.phase3_product_build.products.length - 1) {
                nextStepIndex++; setCurrentBuild({});
                 // Show modal for next product
                 const nextProdStep = lessonData.phase3_product_build.products[nextStepIndex];
                 if (nextProdStep?.modal_detail) {
                     modalToShow = {
                         title: `Next Product: ${nextProdStep.modal_detail.title}`,
                         content: nextProdStep.modal_detail.content,
                         onContinue: null
                     };
                 }
            } else {
                nextPhase = 4;
                 // Show modal before showing final equation
                 modalToShow = {
                     title: `Awesome! Products Are Ready!`,
                     content: `<p>Bhaiyya, humne saare products bana liye hain. Ab time hai poori kahani ko ek saath dekhne ka (The Final Equation). Ready ho jao for the Grand Finale!</p>`,
                     onContinue: null
                 };
            }
        } else if (phase === 4) {
             nextPhase = 5;
        }

        // Apply state changes
        setPhase(nextPhase);
        setStepIndex(nextStepIndex);

        // Show modal if defined for this transition
        if (modalToShow) {
            showModal(modalToShow.title, modalToShow.content, modalToShow.onContinue);
        }
        console.log(`Advanced to phase ${nextPhase}, step ${nextStepIndex}`);
     };

    // --- Build Logic (Remains the same) ---
     const checkBuildMatch = (step) => {
        if (!step || !lessonData) return false; // Added lessonData check
        const correctBuildData = step.correct_build;
        if (!correctBuildData) return false;

        const requiredElements = correctBuildData.reduce((acc, item) => {
            acc[item.symbol] = (acc[item.symbol] || 0) + item.count;
            return acc;
        }, {});

        const requiredKeys = Object.keys(requiredElements);
        const currentKeys = Object.keys(currentBuild);

        // Allow extra elements to be selected but ignore them for check
        // if (currentKeys.length !== requiredKeys.length) return false; // Removed this strict check

        // Check if all required keys are present and have the correct count
        return requiredKeys.every(symbol => currentBuild[symbol] === requiredElements[symbol]);
     };

    // --- Event Handlers ---
    const triggerShake = () => { /* ... same ... */
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };
    const handleElementSelect = (symbol, count) => { /* ... same ... */
        if (!lessonData) return;
        const steps = phase === 2 ? lessonData.phase2_reactant_build.steps : lessonData.phase3_product_build.products;
        const currentStep = steps?.[stepIndex];
        if (!currentStep || checkBuildMatch(currentStep)) return; // Check if build is already correct

        const newCount = (currentBuild[symbol] || 0) + count;
        if (newCount < 0) return; // Prevent negative counts

        setCurrentBuild(prevBuild => {
            const newBuild = { ...prevBuild };
            if (newCount > 0) {
                newBuild[symbol] = newCount;
            } else {
                delete newBuild[symbol]; // Remove if count goes to 0
            }
            return newBuild;
        });
    };
    const handleCheckBuild = () => { /* ... same, calls advancePhase on correct ... */
        if (!lessonData) return;
        const steps = phase === 2 ? lessonData.phase2_reactant_build.steps : lessonData.phase3_product_build.products;
        const currentStep = steps?.[stepIndex];

        if (Object.keys(currentBuild).length === 0 || !currentStep) return;

        if (!checkBuildMatch(currentStep)) {
            triggerShake();
        } else {
            advancePhase(); // Directly call advancePhase on correct build
        }
    };
    const handleDragStart = (e, item) => { /* ... same ... */
        if (phase !== 1.1) return;
        setMatchingGame(prev => ({ ...prev, currentDragItem: item }));
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.symbol);
    };
    const handleDrop = (e, targetSymbol) => { /* ... same, calls advancePhase on correct ... */
        e.preventDefault();
        if (phase !== 1.1 || !lessonData) return;
        const item = matchingGame.currentDragItem;

        if (!item || matchingGame.correctMatches.has(targetSymbol)) return;

        if (item.symbol === targetSymbol) {
            const matchFound = lessonData.phase1_element_roles.matching_pairs.find(p => p.symbol === targetSymbol);
            const newCorrectMatches = new Map(matchingGame.correctMatches);
            newCorrectMatches.set(targetSymbol, matchFound.role_name);

             const updatedOptions = matchingGame.options.filter(opt => opt.symbol !== item.symbol);

            setMatchingGame(prev => ({
                ...prev,
                correctMatches: newCorrectMatches,
                options: updatedOptions,
                currentDragItem: null
            }));

            // Check if matching is complete AFTER state update
            if (newCorrectMatches.size === lessonData.phase1_element_roles.matching_pairs.length) {
                 // Trigger advancePhase directly, which will handle the transition modal to Phase 2
                 advancePhase();
            }
        } else {
            triggerShake(); // Shake on incorrect match
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoadingLesson) { /* ... loading spinner ... */
             return (
                 <div className="text-center space-y-4">
                     {/* Simple loading dots */}
                     <div className="flex justify-center items-center space-x-2">
                         <div className="w-4 h-4 bg-brand-primary rounded-full animate-bounce"></div>
                         <div className="w-4 h-4 bg-brand-primary rounded-full animate-bounce animation-delay-200" style={{animationDelay: '0.2s'}}></div>
                         <div className="w-4 h-4 bg-brand-primary rounded-full animate-bounce animation-delay-400" style={{animationDelay: '0.4s'}}></div>
                     </div>
                     <p className="text-lg text-gray-600">Bhaiyya is preparing your special lesson...</p>
                 </div>
             );
         }
        if (errorLoadingLesson) { /* ... error message ... */
             return (
                 <div className="text-center text-red-600">
                     <h3 className="text-xl font-bold mb-2">Oops! Gadbad ho gayi!</h3>
                     <p>Could not load the lesson: {errorLoadingLesson}</p>
                     {/* Optionally add a retry button */}
                     {/* <button onClick={fetchLesson} className="btn-primary mt-4">Retry</button> */}
                 </div>
             );
         }
        if (!lessonData) { return <div className="text-center text-lg text-gray-500">Preparing lesson...</div>; }

        // Don't render main content if the initial modal should be showing but isn't open yet
        if (phase === 1.0 && !initialModalShown && !isModalOpen) {
            return <div className="text-center text-lg text-gray-500">Getting started...</div>;
        }

        switch (phase) {
            // Pass advancePhase directly to Phase1Read button
            case 1.0: return <Phase1Read lessonData={lessonData} onAdvance={advancePhase} />;
            case 1.1: return <Phase1Match lessonData={lessonData} matchingGame={matchingGame} onDragStart={handleDragStart} onDrop={handleDrop} />;
            case 2:
            case 3:
                const steps = phase === 2 ? lessonData.phase2_reactant_build.steps : lessonData.phase3_product_build.products;
                const currentStep = steps?.[stepIndex];
                if (!currentStep) return <div>Error: Invalid step index.</div>;
                const availableElements = lessonData.concepts.filter(c => c.type === 'element');
                return (
                    <MoleculeBuilder
                        phase={phase} stepIndex={stepIndex} steps={steps}
                        currentStep={currentStep} currentBuild={currentBuild}
                        availableElements={availableElements}
                        isBuildCorrect={checkBuildMatch(currentStep)}
                        shake={shake}
                        onElementSelect={handleElementSelect}
                        onCheckBuild={handleCheckBuild} // CheckBuild handles advancement on correct
                    />
                );
             // Pass advancePhase directly to FinalEquationDisplay button
            case 4: return <FinalEquationDisplay lessonData={lessonData} onAdvance={advancePhase} />;
            case 5: return <CompletionScreen lessonData={lessonData} onExit={onExit} />;
            default: return <div>Loading Phase...</div>;
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

            {/* Main Content Area */}
            <div className={`card min-h-[500px] flex items-start justify-center transition-transform duration-500 ${shake ? 'animate-shake' : ''}`}> {/* Changed items-center to items-start */}
                 <div className="w-full"> {/* Ensure content takes full width */}
                    {renderContent()}
                 </div>
            </div>

             {/* Modal */}
             <InfoModal
                 isOpen={isModalOpen}
                 title={modalContent.title}
                 content={modalContent.content}
                 onClose={closeModal} // Close button always just closes
                 onContinue={nextAction ? closeModal : null} // Continue button calls closeModal which then calls nextAction if it exists
             />
        </div>
    );
};


export default EquationTutor;