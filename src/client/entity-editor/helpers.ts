/*
 * Copyright (C) 2016  Ben Ockmore
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


import AuthorSection from './author-section/author-section';
import AuthorSectionMerge from './author-section/author-section-merge';
import EditionGroupSection from './edition-group-section/edition-group-section';
import EditionGroupSectionMerge from './edition-group-section/edition-group-section-merge';
import EditionSection from './edition-section/edition-section';
import EditionSectionMerge from './edition-section/edition-section-merge';
import PublisherSection from './publisher-section/publisher-section';
import PublisherSectionMerge from './publisher-section/publisher-section-merge';
import {RelationshipForDisplay} from './relationship-editor/types';
import SeriesSection from './series-section/series-section';
import SeriesSectionMerge from './series-section/series-section-merge';
import WorkSection from './work-section/work-section';
import WorkSectionMerge from './work-section/work-section-merge';
import aliasEditorReducer from './alias-editor/reducer';
import annotationSectionReducer from './annotation-section/reducer';
import authorSectionReducer from './author-section/reducer';
import buttonBarReducer from './button-bar/reducer';
import {combineReducers} from 'redux-immutable';
import editionGroupSectionReducer from './edition-group-section/reducer';
import editionSectionReducer from './edition-section/reducer';
import {getAttributeName} from './relationship-editor/helper';
import identifierEditorReducer from './identifier-editor/reducer';
import nameSectionReducer from './name-section/reducer';
import publisherSectionReducer from './publisher-section/reducer';
import relationshipSectionReducer from './relationship-editor/reducer';
import seriesSectionReducer from './series-section/reducer';
import submissionSectionReducer from './submission-section/reducer';
import {validateForm as validateAuthorForm} from './validators/author';
import {validateForm as validateEditionForm} from './validators/edition';
import {
	validateForm as validateEditionGroupForm
} from './validators/edition-group';
import {validateForm as validatePublisherForm} from './validators/publisher';
import {validateForm as validateSeriesForm} from './validators/series';
import {validateForm as validateWorkForm} from './validators/work';
import workSectionReducer from './work-section/reducer';


export function isAliasEmpty(
	nameValue: string, sortNameValue: string, languageValue: number | null | undefined
): boolean {
	return !(nameValue.length || sortNameValue.length || languageValue);
}

export function isRequiredDisambiguationEmpty(
	required: boolean, disambiguation: string
): boolean {
	return required ? !disambiguation : false;
}

export function getEntitySection(entityType: string) {
	const SECTION_MAP = {
		author: AuthorSection,
		edition: EditionSection,
		editionGroup: EditionGroupSection,
		publisher: PublisherSection,
		series: SeriesSection,
		work: WorkSection
	};

	return SECTION_MAP[entityType];
}

export function getEntitySectionMerge(entityType: string) {
	const SECTION_MAP = {
		author: AuthorSectionMerge,
		edition: EditionSectionMerge,
		editionGroup: EditionGroupSectionMerge,
		publisher: PublisherSectionMerge,
		series: SeriesSectionMerge,
		work: WorkSectionMerge
	};

	return SECTION_MAP[entityType];
}

function getEntitySectionReducer(entityType: string) {
	const SECTION_REDUCER_MAP = {
		author: authorSectionReducer,
		edition: editionSectionReducer,
		editionGroup: editionGroupSectionReducer,
		publisher: publisherSectionReducer,
		series: seriesSectionReducer,
		work: workSectionReducer
	};

	return SECTION_REDUCER_MAP[entityType];
}

export function getValidator(entityType: string) {
	const VALIDATOR_MAP = {
		author: validateAuthorForm,
		edition: validateEditionForm,
		editionGroup: validateEditionGroupForm,
		publisher: validatePublisherForm,
		series: validateSeriesForm,
		work: validateWorkForm
	};

	return VALIDATOR_MAP[entityType];
}

function getEntitySectionReducerName(entityType: string): string {
	return `${entityType}Section`;
}

export function createRootReducer(entityType: string) {
	const entityReducerKey = getEntitySectionReducerName(entityType);
	const entityReducer = getEntitySectionReducer(entityType);

	return combineReducers({
		aliasEditor: aliasEditorReducer,
		annotationSection: annotationSectionReducer,
		buttonBar: buttonBarReducer,
		[entityReducerKey]: entityReducer,
		identifierEditor: identifierEditorReducer,
		nameSection: nameSectionReducer,
		relationshipSection: relationshipSectionReducer,
		submissionSection: submissionSectionReducer
	});
}

type ReduxWindow = typeof window & {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any};
export function shouldDevToolsBeInjected(): boolean {
	return Boolean(
		typeof window === 'object' &&
		(window as ReduxWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	);
}

/**
 * Takes an array of relationships and attach the deeply nested
 * relationship attributes to the first level of the relationship object.
 *
 * @param {Array} relationships the array of relationships
 */
export function attachAttribToRelForDisplay(relationships: RelationshipForDisplay[]) {
	relationships.forEach((relationship) => {
		relationship.attributes.forEach(attribute => {
			const attributeName = getAttributeName(attribute.attributeType);
			relationship[attributeName] = attribute.value.textValue;
		});
	});
}
