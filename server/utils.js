class Utils {
  constructor() {
    let seedFunction = this.hash(new Date(Date.now()).valueOf().toString());
    this.random = this.mulberry32(seedFunction());
  }

  random;

  hash(seed) {
    for(var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++)
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
  }

  mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  randHex(len) {
    let maxlen = 8;
    let min = Math.pow(16,Math.min(len,maxlen)-1);
    let max = Math.pow(16,Math.min(len,maxlen)) - 1;
    let n = Math.floor( this.random() * (max-min+1) ) + min;
    let r = n.toString(16);
    while (r.length < len) {
      r = r + this.randHex( len - maxlen );
    }
    return r;
  }

  isEmpty(aValue) {
    if (aValue == 0) { return false; }
    if (aValue) {
      if (typeof aValue == 'string') {
        if (aValue.length > 0) {
          return false;
        }
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }

  arrayIncludes(anArray, anItem, anId = null) {
    let included = false;
    if (anId != null) {
      anArray.map((aMember) => {
        if (aMember[anId] == anItem[anId]) {
          included = true;
        }
      });
    }
    else {
      anArray.map((aMember) => {
        if (aMember == anItem) {
          included = true;
        }
      });
    }
    return included;
  }

  randomWeightedSelect(anArray, weightName = 'weight') {
    let weightSum = 0;
    let buckets = [];
    anArray.map((aMember, index) => {
      weightSum += aMember[weightName];
      buckets.push(weightSum);
    });
    let roll = this.random() * weightSum;
    for (let index = 0; index < anArray.length; index++) {
      if (roll < buckets[index]) {
        return anArray[index];
      }
    }
    return anArray[0];
  }
}

let utils = new Utils();

module.exports = { utils };
