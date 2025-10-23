// src/types/EquationLesson.js (Example using comments, or use PropTypes/TypeScript)

/**
 * @typedef {object} EquationLessonConcept
 * @property {string} id
 * @property {string} intuitive_name
 * @property {string} symbol
 * @property {string} type - 'element' | 'reactant_molecule' | 'product'
 */

/**
 * @typedef {object} EquationLessonElementRole
 * @property {string} symbol
 * @property {string} role
 * @property {string} analogy
 */

/**
 * @typedef {object} EquationLessonMatchingPair
 * @property {string} symbol
 * @property {string} role_name
 */

/**
 * @typedef {object} EquationLessonBuildComponent
 * @property {string} symbol
 * @property {number} count
 */

/**
 * @typedef {object} EquationLessonModalDetail
 * @property {string} title
 * @property {string} content - Can contain basic HTML like <p>, <strong>
 */

/**
 * @typedef {object} EquationLessonBuildStep
 * @property {string} molecule_id - ID matching a concept
 * @property {string} molecule_formula
 * @property {string} role_analogy
 * @property {string} why_and_how_it_works
 * @property {string} build_prompt
 * @property {EquationLessonBuildComponent[]} correct_build
 * @property {number} coefficient
 * @property {EquationLessonModalDetail} modal_detail
 */
/**
 * @typedef {object} EquationLessonProductStep
 * @property {string} product_id - ID matching a concept
 * @property {string} product_formula
 * @property {string} role_analogy
 * @property {string} why_and_how_it_works
 * @property {string} build_prompt
 * @property {EquationLessonBuildComponent[]} correct_build
 * @property {number} coefficient
 * @property {EquationLessonModalDetail} modal_detail
 */


/**
 * @typedef {object} EquationLessonFinalDisplayPart
 * @property {'display' | 'operator'} type
 * @property {string} value
 */


/**
 * @typedef {object} EquationLesson
 * @property {{title: string, formula: string}} equation
 * @property {string} analogy
 * @property {EquationLessonConcept[]} concepts
 * @property {{
 * prompt: string,
 * elements: EquationLessonElementRole[],
 * matching_prompt: string,
 * matching_pairs: EquationLessonMatchingPair[]
 * }} phase1_element_roles
 * @property {{
 * prompt: string,
 * steps: EquationLessonBuildStep[]
 * }} phase2_reactant_build
 * @property {{
 * prompt: string,
 * products: EquationLessonProductStep[],
 * final_equation_display: EquationLessonFinalDisplayPart[],
 * final_story_workflow: string
 * }} phase3_product_build
 * @property {{title: string, text: string}} summary
 */

// export {}; // Add this if using TypeScript or modules