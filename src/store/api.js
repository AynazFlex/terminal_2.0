class Api {
  constructor({ url }) {
    this.url = url;
  }

  async post(query, body, type) {
    const options = {
      method: "POST",
      body,
    };

    if (type)
      Object.assign(options, {
        headers: {
          "Content-Type": type,
        },
      });

    const response = await fetch(this.url + query, options);

    if (!response.ok) throw new Error();

    return await response.json();
  }
}

export default new Api({
  url: "http://51.250.97.147/api/v1",
});
