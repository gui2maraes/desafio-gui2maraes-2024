import { RecintosZoo } from "./recintos-zoo.js";

describe("Recintos do Zoologico", () => {
  test("Deve rejeitar animal inválido", () => {
    const resultado = new RecintosZoo().analisaRecintos("UNICORNIO", 1);
    expect(resultado.erro).toBe("Animal inválido");
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve rejeitar quantidade inválida", () => {
    const resultado = new RecintosZoo().analisaRecintos("MACACO", 0);
    expect(resultado.erro).toBe("Quantidade inválida");
    expect(resultado.recintosViaveis).toBeFalsy();

    const resultado2 = new RecintosZoo().analisaRecintos("MACACO", -1);
    expect(resultado2.erro).toBe("Quantidade inválida");
    expect(resultado2.recintosViaveis).toBeFalsy();
  });

  test("Não deve encontrar recintos para 10 macacos", () => {
    const resultado = new RecintosZoo().analisaRecintos("MACACO", 10);
    expect(resultado.erro).toBe("Não há recinto viável");
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve encontrar recinto para 1 crocodilo", () => {
    const resultado = new RecintosZoo().analisaRecintos("CROCODILO", 1);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis[0]).toBe(
      "Recinto 4 (espaço livre: 5 total: 8)",
    );
    expect(resultado.recintosViaveis.length).toBe(1);
  });

  test("Deve encontrar recintos para 2 macacos", () => {
    const resultado = new RecintosZoo().analisaRecintos("MACACO", 2);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis[0]).toBe(
      "Recinto 1 (espaço livre: 5 total: 10)",
    );
    expect(resultado.recintosViaveis[1]).toBe(
      "Recinto 2 (espaço livre: 3 total: 5)",
    );
    expect(resultado.recintosViaveis[2]).toBe(
      "Recinto 3 (espaço livre: 2 total: 7)",
    );
    expect(resultado.recintosViaveis.length).toBe(3);
  });
  test("Deve recusar macaco solitário", () => {
    const resultado = new RecintosZoo().analisaRecintos("MACACO", 1);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis[0]).toBe(
      "Recinto 1 (espaço livre: 6 total: 10)",
    );
    expect(resultado.recintosViaveis[1]).toBe(
      "Recinto 3 (espaço livre: 3 total: 7)",
    );
    expect(resultado.recintosViaveis.length).toBe(2);
  });
  test("Hipopótamo antisocial", () => {
    const res = new RecintosZoo().analisaRecintos("HIPOPOTAMO", 1);
    expect(res.erro).toBeFalsy();
    expect(res.recintosViaveis[0]).toBe("Recinto 3 (espaço livre: 0 total: 7)");
    expect(res.recintosViaveis[1]).toBe("Recinto 4 (espaço livre: 4 total: 8)");
    expect(res.recintosViaveis.length).toBe(2);
  });
  test("Leão carnívoro", () => {
    const res = new RecintosZoo().analisaRecintos("LEAO", 1);
    expect(res.erro).toBeFalsy();
    expect(res.recintosViaveis[0]).toBe("Recinto 5 (espaço livre: 3 total: 9)");
    expect(res.recintosViaveis.length).toBe(1);
  });
  test("Leopardo carnívoro", () => {
    const res = new RecintosZoo().analisaRecintos("LEOPARDO", 1);
    expect(res.erro).toBe("Não há recinto viável");
  });
  test("Gazelas", () => {
    const res = new RecintosZoo().analisaRecintos("GAZELA", 1);
    expect(res.erro).toBeFalsy();
    expect(res.recintosViaveis[0]).toBe(
      "Recinto 1 (espaço livre: 4 total: 10)",
    );
    expect(res.recintosViaveis[1]).toBe("Recinto 3 (espaço livre: 3 total: 7)");
    expect(res.recintosViaveis.length).toBe(2);
  });
  test("Muitos crocodilos", () => {
    const res = new RecintosZoo().analisaRecintos("CROCODILO", 3);
    expect(res.erro).toBe("Não há recinto viável");
  });
  test("Recinto quase lotado", () => {
    const res = new RecintosZoo().analisaRecintos("MACACO", 7);
    expect(res.erro).toBeFalsy();
    expect(res.recintosViaveis[0]).toBe(
      "Recinto 1 (espaço livre: 0 total: 10)",
    );
    expect(res.recintosViaveis.length).toBe(1);
  });
});
