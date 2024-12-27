import typing
import operator
from functools import reduce
import pandas as pd
from .db import get_providers


def find_best_matching_providers(
    areas_of_concern: typing.List[str] = None,
    preferred_treatment_modality: typing.List[str] = None,
    therapist_preferences: typing.List[str] = None,
    locations: str = None,
    payment_method: typing.List[str] = None,
    languages: typing.List[str] = None,
) -> pd.DataFrame:
    """
    Find the best matching providers using a combination of scoring and
    filtering.

    Scoring:

    - Specialties
    - Treatment modalities
    - Therapist preferences

    Filtering:

    - Locations
    - Languages
    - Payment method

    There is no filtering or scoring based on the demographics of the searcher
    as we cannot assume they want a therapist of similar demographics. Instead
    we allow the searcher to choose preferred language and therapist
    demographics.
    """

    providers = scored_providers(
        get_providers(),
        areas_of_concern=areas_of_concern,
        preferred_treatment_modality=preferred_treatment_modality,
        therapist_preferences=therapist_preferences,
    )

    providers = filtered_providers(
        providers,
        locations=locations,
        payment_method=payment_method,
        languages=languages,
    )

    score_sorted = providers.sort_values("score", ascending=False)

    return score_sorted[0:3]


def filtered_providers(
    providers,
    locations: str = None,
    payment_method: typing.List[str] = None,
    languages: typing.List[str] = None,
):
    if locations:
        providers = filtered_by_strings(providers, "Location", locations)

    # Payment method isn't in the mock data provided, so although we're free to
    # modify the mock data, for expediency's sake we're simply ignoring this
    # filter criteria.

    # if payment_method:
    #     providers = filtered_by_strings(providers, "Payment", payment_method)

    if languages:
        providers = filtered_by_strings(providers, "Language", languages)

    return providers


def filtered_by_strings(providers, column, criteria):
    matches = reduce(
        operator.or_,
        (
            providers[column].str.contains(atom, case=False, na=False)
            for atom in criteria
        ),
    )
    return providers[matches]


def scored_providers(
    providers,
    areas_of_concern: typing.List[str] = None,
    preferred_treatment_modality: typing.List[str] = None,
    therapist_preferences: typing.List[str] = None,
):
    providers = providers.copy()

    areas_of_concern_scores = str_score_column(
        providers, "Areas of Specialization", areas_of_concern
    )

    preferred_treatment_modality_scores = str_score_column(
        providers, "Treatment Modality", preferred_treatment_modality
    )

    therapist_preferences_scores = str_score_column(
        providers, "Ethnic Identity", therapist_preferences
    ) + str_score_column(
        providers, "Gender Identity", therapist_preferences
    )  # this needs proper tokenization but complex matching remains out of scope for this challenge

    total_score = (
        therapist_preferences_scores
        + preferred_treatment_modality_scores
        + areas_of_concern_scores
    )

    providers["score"] = total_score

    return providers


def str_score_column(providers: pd.DataFrame, column: str, candidates):
    """
    Simple substring based scoring function.

    For efficiency this should be indexed in advance, and for accuracy it should
    be tokenized and lemmatized, but this is a prototype, and for anything other
    than a prototype we'd be using a search platform like Elastic Search so it's
    a moot point; anyhow, for production use cases it would be better to go with
    a vector-based implementation for practical, performant, and effective
    scoring.
    """

    if not candidates:
        return pd.Series(0, index=providers.index)

    return sum(
        providers[column].str.contains(candidate, case=False, na=False)
        for candidate in candidates
    )


if __name__ == "__main__":
    results = find_best_matching_providers(
        areas_of_concern=["low self-esteem"],
        therapist_preferences=["female"],
        locations=["ca"],
        preferred_treatment_modality=["cbt"],
    )
    print(results)
