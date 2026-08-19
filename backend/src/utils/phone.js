import { parsePhoneNumberFromString } from "libphonenumber-js/max";

/**
 * Parses and validates a phone number, normalizing it to E.164 and several
 * other common formats. Returns `null` for anything that isn't a valid
 * number rather than throwing, so callers can use it directly as both a
 * validity check (`!== null`) and a normalizer.
 *
 * Also self-heals one specific real-world input mistake: a Ghanaian number
 * typed with both the country code *and* the local leading zero kept
 * (`+2330241234567` instead of `+233241234567`) — the first parse attempt
 * fails, so a retry strips that extra zero and tries again.
 *
 * @param {string} value - The raw phone number as typed by the user.
 * @param {string} [defaultCountry="GH"] - ISO country code to assume when `value` has no explicit international prefix.
 * @returns {{
 *   input: string,
 *   country: string,
 *   countryCallingCode: string,
 *   national: string,
 *   e164: string,
 *   international: string,
 *   nationalFormatted: string,
 *   type: string|null,
 *   isValid: true
 * } | null} The normalized number, or `null` if it isn't a valid number.
 */
const normalizePhoneNumber = (value, defaultCountry = "GH") => {
    if(typeof value !== "string"){
        return null;
    }

    let raw = value.trim();

    if(!raw){
        return null;
    }

    if(raw.length > 50){
        raw = raw.slice(0, 50);
    }

    raw = raw.replace(/[()\s-]/g, "");

    let phoneNumber;

    try{
        phoneNumber = parsePhoneNumberFromString(raw, defaultCountry);
    }catch{
        phoneNumber = undefined;
    }

    if(
        (!phoneNumber || !phoneNumber.isValid()) &&
        /^\+2330\d+$/.test(raw)
    ){
        const retry = raw.replace(/^\+2330/, "+233");

        try{
            phoneNumber = parsePhoneNumberFromString(retry);
        }catch{
            phoneNumber = undefined 
        }
    };

    if(!phoneNumber || !phoneNumber.isValid()){
        return null;
    }

    return {
        input: raw,
        country: phoneNumber.country || defaultCountry,
        countryCallingCode: `+${phoneNumber.countryCallingCode}`,
        national: phoneNumber.nationalNumber,
        e164: phoneNumber.number,
        international: phoneNumber.formatInternational(),
        nationalFormatted: phoneNumber.formatNational(),
        type: phoneNumber.getType?.() ||null,
        isValid: true
    }
}
export {
    normalizePhoneNumber,
}
