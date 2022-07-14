const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.apiHello = functions.https.onRequest((req, res) => {
  const collection = admin.firestore().collection("seizuresResponse");

  collection.add({
    userId: "my test user id",
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    f1: 0,
    f2: 0,
    g: 1,
    h: 0,
    age: 24,
    sex: "M",
  });

  res.send("hello from Firebase function");
});

exports.apiEpipickSeizures = functions.firestore
  .document("/seizuresResponse/{id}")
  .onCreate((snap, context) => {
    const collection = admin.firestore().collection("ApiSeizuresResponse");
    const { id } = context.params;

    const ans = [];
    let { userId, a, b, c, d, e, f, f1, f2, g, h, age, sex } =
      snap._fieldsProto;

    // console.log({ a, b, c, d, e, f, g, h, age, sex });

    if (
      !a?.integerValue ||
      !b?.integerValue ||
      !c?.integerValue ||
      !d?.integerValue ||
      !e?.integerValue ||
      !f?.integerValue ||
      !g?.integerValue ||
      !h?.integerValue
    ) {
      return admin
        .firestore()
        .collection("seizuresResponse")
        .doc(id)
        .update({ msgFromApi: "INVALID INPUT" });
    }

    a = a.integerValue * 1;
    b = b.integerValue * 1;
    c = c.integerValue * 1;
    d = d.integerValue * 1;
    e = e.integerValue * 1;
    f = {
      f: f.integerValue * 1,
      f1: f1.integerValue * 1,
      f2: f2.integerValue * 1,
    };
    g = g.integerValue * 1;
    h = h.integerValue * 1;

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

    //  a combined with anything = focal
    if (a) {
      ans.push("focal");
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data: ans,
        docCreatedAt: new Date(),
      });
    }
    // d combined with anything = focal
    if (d) {
      ans.push("focal");
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data: ans,
        docCreatedAt: new Date(),
      });
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

      // console.log({ resTo: id, status: "success", data: ans });
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data: ans,
        docCreatedAt: new Date(),
      });
    }
  });

exports.apiEpipickMed = functions.firestore
  .document("/ApiSeizuresResponse/{id}")
  .onCreate((snap, context) => {
    const { id } = context.params;
    const { userId, data, age, sex } = snap._fieldsProto;
    let a = data.arrayValue.values;
    a = a.map((el) => {
      return el.stringValue;
    });
    const collection = admin.firestore().collection(`/ApiSeizuresResponse/${id}/ApiSeizuresMedResponse`);
    console.log({ data, age, sex, a });

    if (
      a.includes("GTCS") &&
      a.includes("myoclonic") &&
      a.includes("absence")
    ) {
      const data = {
        G1: ["VPA"],
        G2: ["LTG", "LEV"],
        G3: ["TPM", "ZNS", "CLB"],
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("myoclonic") && a.includes("absence")) {
      const data = {
        G1: ["VPA", "ETV"],
        G2: ["LTG", "LEV"],
        G3: ["TPM", "ZNS", "CLB", "CLN"],
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("GTCS") && a.includes("myoclonic")) {
      const data = {
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
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("GTCS") && a.includes("absence")) {
      const data = {
        G1: ["VPA"],
        G2: ["LTG", "LEV"],
        G3: ["TPM", "ZNS", "CLB"],
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("absence")) {
      const data = {
        G1: ["ETS", "VPA"],
        G2: ["LTG"],
        G3: ["LEV", "ZNS", "ACT", "CLB", "CLN"],
      };

      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("myoclonic")) {
      const data = {
        G1: ["CLN", "VPA", "LEV"],
        G2: ["CLB"],
        G3: ["TPM", "ZNS", "PB", "NTR"],
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("GTCS")) {
      const data = {
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
      };
      // console.log({
      //   status: "success",
      //   data
      // });
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
    }

    if (a.includes("focal")) {
      const data = {
        G1: ["LEV", "CBZ", "LTG", "OXC", "ESL", "LCM"],
        G2: ["TPM", "VPA", "PER", "PHT", "BRV", "ZNS"],
        G3: ["CLB", "PB", "GBP", "PGB"],
      };
      return collection.add({
        resTo: id,
        userId: userId.stringValue,
        status: "success",
        data,
        docCreatedAt: new Date(),
      });
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
