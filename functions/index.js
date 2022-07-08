const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.apiHello = functions.https.onRequest((req, res) => {
  res.send("hello from Firebase function");
});

exports.apiEpipickSeizures = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    res.send('this rout only works on "POST" request');
  }
  const ans = [];
  const { a, b, c, d, e, f, g, h, age, sex } = req.body;

  // b combined with (e or f or g) = select the non-b choices (b is ignored in these combinations)
  if (b && (e || f.f || g)) {
    b = 0;
  }

  // c combined with (e or f or g) = select the non-c choices (c is ignored in these combinations)
  if (c && (e || f.f || g)) {
    c = 0;
  }

  if (h) {
    ans.push("non-epileptic");
  }

  //  a combined with anything = foca
  if (a) {
    ans.push("focal");
    res.json({ status: "success", data: ans });
  }
  // d combined with anything = focal
  if (d) {
    ans.push("focal");
    res.json({ status: "success", data: ans });
  }

  // Any a, b, c or d = focal
  if (b || c) {
    ans.push("focal");
  }

  //   e,e&f,e&g,e&f&g
  if (e) {
    ans.push("absence");
    if (f.f) {
      ans.push("myoclonic");
    }
    if (g) {
      ans.push("GTCS");
    }
  } else {
    // f, f&g
    if (f.f) {
      ans.push("myoclonic");
      if (g) {
        ans.push("GTCS");
      }
    } else {
      // g
      if (g) {
        ans.push("GTCS");
      }
    }

    res.send({ status: "success", data: ans });
  }
});

exports.apiEpipickMed = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    res.send('this rout only works on "POST" request');
  }
  const { a, age, sex } = req.body;

  if (a.includes("GTCS") && a.includes("myoclonic") && a.includes("absence")) {
    res.send({
      status: "success",
      data: { G1: ["VPA"], G2: ["LTG", "LEV"], G3: ["TPM", "ZNS", "CLB"] },
    });
    return;
  }

  if (a.includes("myoclonic") && a.includes("absence")) {
    res.send({
      status: "success",
      data: {
        G1: ["VPA", "ETV"],
        G2: ["LTG", "LEV"],
        G3: ["TPM", "ZNS", "CLB", "CLN"],
      },
    });
    return;
  }

  if (a.includes("GTCS") && a.includes("myoclonic")) {
    res.send({
      status: "success",
      data: {
        G1: ["VPA"],
        G2: ["LEV"],
        G3: [
          "CLN",
          "LTG",
          "ZNS",
          "CLB",
          "TPM",
          "PB",
          "PER",
          "PHT",
          "LCS",
          "BRV",
        ],
      },
    });
    return;
  }

  if (a.includes("GTCS") && a.includes("absence")) {
    res.send({
      status: "success",
      data: {
        G1: ["VPA"],
        G2: ["LTG", "LEV"],
        G3: ["TPM", "ZNS", "CLB"],
      },
    });
    return;
  }

  if (a.includes("absence")) {
    res.send({
      status: "success",
      data: {
        G1: ["ETS", "VPA"],
        G2: ["LTG"],
        G3: ["LEV", "ZNS", "ACT", "CLB", "CLN"],
      },
    });
    return;
  }

  if (a.includes("myoclonic")) {
    res.send({
      status: "success",
      data: {
        G1: ["CLN", "VPA", "LEV"],
        G2: ["CLB"],
        G3: ["TPM", "ZNS", "PB", "NTR"],
      },
    });
    return;
  }

  if (a.includes("GTCS")) {
    res.send({
      status: "success",
      data: {
        G1: ["VPA"],
        G2: ["LTG", "LEV"],
        G3: [
          "OXC",
          "CLB",
          "ZNS",
          "LCM",
          "TPM",
          "PB",
          "PER",
          "CBZ",
          "PHT",
          "BRV",
        ],
      },
    });
    return;
  }

  if (a.includes("focal")) {
    res.send({
      status: "success",
      data: {
        G1: ["LEV", "CBZ", "LTG", "OXC", "ESL", "LCM"],
        G2: ["TPM", "VPA", "PER", "PHT", "BRV", "ZNS"],
        G3: ["CLB", "PB", "GBP", "PGB"],
      },
    });
    return;
  }
  // Unknown
  // if (a === "focal") {
  //   return {
  //     G1: ["LEV", "CBZ", "LTG", "OXC", "ESL", "LCM"],
  //     G2: ["TPM", "VPA", "PER", "PHT", "BRV", "ZNS"],
  //     G3: ["CLB", "PB", "GBP", "PGB"],
  //   };
  // }

  // if (a === "focal") {
  //   return {
  //     G1: ["LEV", "CBZ", "LTG", "OXC", "ESL", "LCM"],
  //     G2: ["TPM", "VPA", "PER", "PHT", "BRV", "ZNS"],
  //     G3: ["CLB", "PB", "GBP", "PGB"],
  //   };
  // }
});
