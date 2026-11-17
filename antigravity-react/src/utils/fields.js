export const NAME_MAX = 32;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 32;
export const EMAIL_MAX = 100;
export const PHONE_MAX_DIGITS = 15;
export const ADDRESS_MAX = 255;
export const TITLE_MAX = 50;
export const MESSAGE_MAX = 250;
export const SEARCH_MAX = 80;
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

/** */
const ok = (value) => ({ ok: true, value });
const fail = (error = "Invalid value") => ({ ok: false, error });

/** */
const NAME_RE = /^[\p{L}\p{M}' -]+$/u;
const USERNAME_RE = /^[A-Za-z0-9_]+$/;

/** */
const ADDRESS_RE = /^[\p{L}\p{M}\p{N} .,#'()\/&:\-]+$/u;

/** */
const NO_CONTROL_CHARS = /^[^\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]*$/;

/** */
const EMAIL_RE =
	/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const ISO_DATETIME_RE =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

/** */
const text =
	({ min = 1, max, regex, trim = true, message }) =>
	(input) => {
		if (typeof input !== "string") return fail(message);
		const v = trim ? input.trim() : input;
		if (v.length < min || v.length > max) return fail(message);
		if (regex && !regex.test(v)) return fail(message);
		return ok(v);
	};

/** */
export const nameField = text({
	max: NAME_MAX,
	regex: NAME_RE,
	message: "Invalid name",
});

/** */
export const usernameField = text({
	min: USERNAME_MIN,
	max: USERNAME_MAX,
	regex: USERNAME_RE,
	trim: false,
	message: "3-32 characters: letters, numbers, underscore",
});

/** */
export const emailField = (input) => {
	if (typeof input !== "string") return fail("Invalid email");
	const v = input.trim();
	if (v.length > EMAIL_MAX || !EMAIL_RE.test(v)) return fail("Invalid email");
	if (v.split("@")[0].length > 64) return fail("Invalid email");
	return ok(v);
};

/** */
export const phoneField = (input) => {
	if (typeof input !== "string") return fail("Invalid phone number");
	const v = input.trim().replace(/[\s().-]/g, "");
	if (!new RegExp(`^\\+?\\d{1,${PHONE_MAX_DIGITS}}$`).test(v))
		return fail("Invalid phone number");
	return ok(v);
};

/** */
export const passwordField = text({
	min: PASSWORD_MIN,
	max: PASSWORD_MAX,
	trim: false,
	message: `Password must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters`,
});

/** */
export const addressField = text({
	max: ADDRESS_MAX,
	regex: ADDRESS_RE,
	message: "Invalid address",
});
/** */
export const titleField = text({
	max: TITLE_MAX,
	regex: NO_CONTROL_CHARS,
	message: "Invalid title",
});
/** */
export const messageField = text({
	max: MESSAGE_MAX,
	regex: NO_CONTROL_CHARS,
	message: "Invalid message",
});
/** */
export const searchField = text({
	min: 0,
	max: SEARCH_MAX,
	regex: NO_CONTROL_CHARS,
	message: "Invalid search",
});
/** */
export const intField = (min, max) => (input) => {
	let n;
	if (typeof input === "number") n = input;
	else if (typeof input === "string" && /^-?\d+$/.test(input.trim()))
		n = Number(input.trim());
	else return fail("Invalid number");
	if (!Number.isSafeInteger(n) || n < min || n > max)
		return fail("Number out of range");
	return ok(n);
};
