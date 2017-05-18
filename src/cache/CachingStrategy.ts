export interface Cached {

}

export interface Named extends Cached {
  name: string;
}

export interface CachingStrategy<Cached> {

}
