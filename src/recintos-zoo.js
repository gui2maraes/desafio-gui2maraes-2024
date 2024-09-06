// @ts-check

class Especie {
  /** @readonly @type {string} */
  especie;
  /** @readonly @type {number} */
  tamanho;
  /** @readonly @type {Set<string>} */
  biomas;

  /** @type {(recinto: Recinto) => boolean} */
  #condicaoComfortavel;

  // lookup table para os animais.
  // já que as propriedades não mudam para
  // cada animal da mesma espécie,
  // podemos só usar o nome do animal como referência
  // ao invés de copiar os objetos
  /** @readonly */
  static especies = {
    LEAO: new Especie("LEAO", 3, ["savana"], condicaoCarnivoro),
    LEOPARDO: new Especie("LEOPARDO", 2, ["savana"], condicaoCarnivoro),
    CROCODILO: new Especie("CROCODILO", 3, ["rio"], condicaoCarnivoro),
    MACACO: new Especie("MACACO", 1, ["savana", "floresta"], condicaoMacaco),
    GAZELA: new Especie("GAZELA", 2, ["savana"]),
    HIPOPOTAMO: new Especie(
      "HIPOPOTAMO",
      4,
      ["savana", "rio"],
      condicaoHipopotamo,
    ),
  };

  /** Cria uma nova espécie
   * @constructor
   * @param {string} especie - nome da espécie
   * @param {number} tamanho - tamanho da espécie
   * @param {string[]} biomas - lista de biomas do recinto
   * @param {(recinto: Recinto) => boolean} condicaoComfortavel - condições necessárias para o animal estar comfortável em um recinto
   */
  // eslint-disable-next-line no-unused-vars
  constructor(especie, tamanho, biomas, condicaoComfortavel = (r) => true) {
    this.especie = especie;
    this.tamanho = tamanho;
    this.biomas = new Set(biomas);
    this.#condicaoComfortavel = condicaoComfortavel;
  }
  /** @param {Recinto} recinto - recinto contendo essa espécie
   * @returns {boolean}
   */
  comfortavel(recinto) {
    const biomaCerto = intersection(recinto.biomas, this.biomas).size > 0;
    return biomaCerto && this.#condicaoComfortavel(recinto);
  }
}

/** @param {Recinto} recinto
 * @returns {boolean}
 */
function condicaoCarnivoro(recinto) {
  return recinto.numeroDeEspecies() == 1;
}
/** @param {Recinto} recinto
 * @returns {boolean}
 */
function condicaoHipopotamo(recinto) {
  if (recinto.numeroDeEspecies() > 1) {
    return recinto.biomas.has("savana") && recinto.biomas.has("rio");
  } else {
    return true;
  }
}
/** @param {Recinto} recinto
 * @returns {boolean}
 */
function condicaoMacaco(recinto) {
  return recinto.numeroDeAnimais() > 1;
}

/** @param {Set<any>} set1
 * @param {Set<any>} set2
 * @returns {Set<any>}
 */
function intersection(set1, set2) {
  let set = new Set();
  set1.forEach((v) => {
    if (set2.has(v)) {
      set.add(v);
    }
  });
  return set;
}

class Recinto {
  /** @type {number} */
  tamanho;
  /** @readonly @type {Set<string>} */
  biomas;
  // map: { objeto_animal: numero,* }
  /** @type {Map<Especie, number>} */
  #especies;

  /** Cria um novo recinto
   * @constructor
   * @param {number} tamanho - tamanho do recinto.
   * @param {string[]} biomas - lista de biomas do recinto
   * @param {[Especie, number][]} especies - lista de tuples contendo espécies e número de animais
   */
  constructor(tamanho, biomas, especies = []) {
    this.tamanho = tamanho;
    this.biomas = new Set(biomas);
    this.#especies = new Map(especies);
  }

  /** @returns {boolean} se esse recinto é comfortável para todos animais nele */
  habitavel() {
    if (this.lotado()) {
      return false;
    }
    for (const animal of this.#especies.keys()) {
      if (!animal.comfortavel(this)) {
        return false;
      }
    }
    return true;
  }
  /** @returns {number} tamanho total do recinto */
  tamanhoTotal() {
    return this.tamanho;
  }

  /** @returns {number} tamanho ocupado do recinto */
  tamanhoOcupado() {
    let ocupado = 0;
    if (this.numeroDeEspecies() > 1) {
      ocupado += 1;
    }
    for (const [animal, num] of this.#especies.entries()) {
      ocupado += animal.tamanho * num;
    }
    return ocupado;
  }
  /** @returns {number} tamanho livre do recinto */
  tamanhoLivre() {
    return this.tamanhoTotal() - this.tamanhoOcupado();
  }
  /** @returns {number} numero de espécies no recinto */
  numeroDeEspecies() {
    return this.#especies.size;
  }

  /** @returns {number} numero total de animais no recinto */
  numeroDeAnimais() {
    let numeroTotal = 0;
    for (const num of this.#especies.values()) {
      numeroTotal += num;
    }
    return numeroTotal;
  }
  /** @returns {boolean} se há mais animais que o tamanho permite */
  lotado() {
    return this.tamanhoOcupado() > this.tamanhoTotal();
  }

  /**
   * Verifica se é possível adicionar um animal no recinto
   * @param {Especie} especie
   * @param {number} numero
   * @returns {boolean} se animal pode ser adicionado no recinto
   */
  cabeAnimal(especie, numero) {
    if (this.adicionarAnimal(especie, numero)) {
      this.removerAnimal(especie, numero);
      return true;
    } else {
      return false;
    }
  }
  /**
   * Tenta adicionar animais no recinto,
   * falha se algum animal não estiver comfortável ou recinto ficar lotado
   * @param {Especie} especie
   * @param {number} numero
   * @returns {boolean} se animal foi adicionado com sucesso
   */
  adicionarAnimal(especie, numero) {
    if (numero < 1) {
      return false;
    }
    const numeroAtual = this.#especies.get(especie) ?? 0;
    this.#especies.set(especie, numero + numeroAtual);
    if (!this.habitavel()) {
      this.removerAnimal(especie, numero);
      return false;
    }
    return true;
  }

  /** Remove animais do recinto
   * @param {Especie} especie
   * @param {number} numero
   */
  removerAnimal(especie, numero) {
    if (numero < 1) {
      return;
    }
    const numeroAtual = this.#especies.get(especie);
    if (numeroAtual == undefined) {
      return;
    }
    if (numeroAtual > numero) {
      this.#especies.set(especie, numeroAtual - numero);
    } else {
      this.#especies.delete(especie);
    }
  }
}

class RecintosZoo {
  /** @type {Map<number, Recinto>} */
  recintos;
  constructor() {
    this.recintos = new Map([
      [1, new Recinto(10, ["savana"], [[Especie.especies.MACACO, 3]])],
      [2, new Recinto(5, ["floresta"])],
      [3, new Recinto(7, ["savana", "rio"], [[Especie.especies.GAZELA, 1]])],
      [4, new Recinto(8, ["rio"])],
      [5, new Recinto(9, ["savana"], [[Especie.especies.LEAO, 1]])],
    ]);
  }
  /** @param {string} animal
   * @param {number} quantidade
   * @returns {Object}
   */

  analisaRecintos(animal, quantidade) {
    if (quantidade < 1) {
      return {
        erro: "Quantidade inválida",
      };
    }
    /** @type {Especie} */
    const especie = Especie.especies[animal];
    if (!especie) {
      return {
        erro: "Animal inválido",
      };
    }
    let recintosViaveis = [];
    for (let i = 1; i <= 5; ++i) {
      const recinto = this.recintos.get(i);
      if (recinto?.adicionarAnimal(especie, quantidade)) {
        recintosViaveis.push(
          `Recinto ${i} (espaço livre: ${recinto.tamanhoLivre()} total: ${recinto.tamanhoTotal()})`,
        );
      }
    }
    if (recintosViaveis.length == 0) {
      return {
        erro: "Não há recinto viável",
      };
    }
    return {
      recintosViaveis: recintosViaveis,
    };
  }
}

export { RecintosZoo as RecintosZoo };
