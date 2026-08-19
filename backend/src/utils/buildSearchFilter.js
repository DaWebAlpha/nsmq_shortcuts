/**
 * Escapes regex metacharacters so user-supplied search text is matched
 * literally instead of being interpreted as a regex pattern.
 * @param {string} value
 * @returns {string}
 */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds a MongoDB query filter combining exact-match fields with a
 * case-insensitive substring search across a set of fields.
 * @param {object} [options]
 * @param {string[]} [options.fields=[]] - Field names to search across with `search`.
 * @param {string} [options.search] - Free-text search term; ignored if blank or `fields` is empty.
 * @param {Record<string, *>} [options.exact={}] - Field/value pairs added as exact-match conditions; falsy values are skipped.
 * @returns {object} A MongoDB filter object, e.g. `{ status: "active", $or: [{ name: /john/i }, { email: /john/i }] }`.
 */
const buildSearchFilter = ({
    fields = [],
    search,
    exact = {}
} = {}) => {
   const filter = {};

   for (const [key, value] of Object.entries(exact)){
        if(value){
            filter[key] = value;
        }
   }

   const trimmedSearch = search?.trim();

   if(trimmedSearch && fields.length){
        const pattern = new RegExp(escapeRegExp(trimmedSearch), "i");
        filter.$or = fields.map((field) => ({ [field]: pattern}));
   }

   return filter;
}

export { buildSearchFilter };