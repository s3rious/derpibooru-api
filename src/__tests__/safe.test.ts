import { describe, it, expect } from "vitest";

import { safe } from "../safe.js";

describe("safe", () => {
  describe("with Promise", () => {
    it("should handle successful promise", async () => {
      const result = await safe(Promise.resolve("test"));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test");
      }
    });

    it("should handle promise rejection with Error", async () => {
      const result = await safe(Promise.reject(new Error("test error")));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("test error");
      }
    });

    it("should handle promise rejection with custom error message", async () => {
      const result = await safe(Promise.reject(new Error("test error")), {
        errorMessage: "custom error",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("custom error");
      }
    });

    it("should handle promise rejection with processError", async () => {
      const result = await safe(Promise.reject({ code: 404 }), {
        processError: (error) =>
          `Custom processed error: ${JSON.stringify(error)}`,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Custom processed error: {"code":404}');
      }
    });

    it("should handle promise rejection with non-Error object", async () => {
      const result = await safe(Promise.reject("string error"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Something went wrong");
      }
    });

    it("should prioritize errorMessage over processError", async () => {
      const result = await safe(Promise.reject({ code: 404 }), {
        errorMessage: "Priority message",
        processError: (error) =>
          `Should not be called: ${JSON.stringify(error)}`,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Priority message");
      }
    });
  });

  describe("with synchronous function", () => {
    it("should handle successful function", () => {
      const result = safe(() => "test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test");
      }
    });

    it("should handle function throwing Error", () => {
      const result = safe(() => {
        throw new Error("test error");
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("test error");
      }
    });

    it("should handle function throwing with custom error message", () => {
      const result = safe(
        () => {
          throw new Error("test error");
        },
        { errorMessage: "custom error" },
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("custom error");
      }
    });

    it("should handle function throwing with processError", () => {
      const result = safe(
        () => {
          throw { code: 404 };
        },
        {
          processError: (error) =>
            `Custom processed error: ${JSON.stringify(error)}`,
        },
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Custom processed error: {"code":404}');
      }
    });

    it("should handle function throwing non-Error object", () => {
      const result = safe(() => {
        throw "string error";
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Something went wrong");
      }
    });

    it("should prioritize errorMessage over processError in sync function", () => {
      const result = safe(
        () => {
          throw { code: 404 };
        },
        {
          errorMessage: "Priority message",
          processError: (error) =>
            `Should not be called: ${JSON.stringify(error)}`,
        },
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Priority message");
      }
    });
  });
});
