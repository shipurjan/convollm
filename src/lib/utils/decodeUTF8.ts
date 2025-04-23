export function decodeUTF8<T>(data: T): T {
  if (typeof data === "string") {
    const utf8 = new Uint8Array(
      Array.prototype.map.call(data, (c: string) =>
        c.charCodeAt(0),
      ) as any as ArrayBuffer,
    );
    return new TextDecoder("utf-8").decode(utf8) as T;
  }

  if (Array.isArray(data)) {
    return data.map(decodeUTF8) as T;
  }

  if (typeof data === "object") {
    const obj: any = {};
    Object.entries(data as any).forEach(([key, value]) => {
      obj[key] = decodeUTF8(value);
    });
    return obj;
  }

  return data;
}
