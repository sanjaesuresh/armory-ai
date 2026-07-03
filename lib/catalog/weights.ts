/**
 * Tunable weight configuration for the Armory scored recommender.
 *
 * All weights are positive additive score contributions unless otherwise noted.
 * Change these values deliberately — a snapshot test in scoring.test.ts will
 * catch any ordering change so you can verify intent before merging.
 */

export interface Weights {
  /** Score awarded when the setup's role exactly matches the user's role. */
  exactRole: number;

  /** Partial credit when the setup's role is in the related-roles list for
   *  the user's role (but is not an exact match). */
  relatedRole: number;

  /** Bonus added when the setup's industry matches the user's optional industry. */
  industryBonus: number;

  /** Score added per shared goal tag between the user's selection and the setup's tags. */
  tagCredit: number;

  /** Multiplier applied to the log-dampened popularity count.
   *  Popularity score = popularityMultiplier * Math.log1p(popularityCount). */
  popularityMultiplier: number;

  /** Maximum score bump for a recently-updated setup. Decays linearly from this
   *  value to zero over FRESHNESS_WINDOW_DAYS (90 days). */
  freshnessBump: number;
}

/** Default weights. Adjust deliberately — any change will fail the snapshot test
 *  in scoring.test.ts, requiring an explicit update. */
export const DEFAULT_WEIGHTS: Weights = {
  exactRole: 10,      // role match is the primary signal
  relatedRole: 4,     // partial credit for a related role; must be < exactRole
  industryBonus: 2,   // soft boost; never a hard filter
  tagCredit: 1.5,     // per-tag credit accumulates with overlap count
  popularityMultiplier: 1, // multiplied by log1p(count); grows sub-linearly
  freshnessBump: 1,   // mild recency advantage; decays to 0 over 90 days
};

/** Number of days over which the freshness bump decays from full to zero. */
export const FRESHNESS_WINDOW_DAYS = 90;

/**
 * Minimum score threshold used by the niche-role fallback (Task 6).
 * When the top-scored setup is below this value, the recommender falls back to
 * showing popular setups with the honest label "Nothing tailored yet — here's
 * what's popular."
 */
export const MIN_SCORE_THRESHOLD = 3;
