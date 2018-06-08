import * as fs from 'fs';
import {safeLoad} from 'js-yaml'
import {MetaBuilder, PrimitiveBuilder, ProxyBuilder} from "../meta/MetaBuilder";
import {ProxyMetaData} from "../meta/ProxyMetaData";
import {MetaMember} from "../meta/MetaMember";
import {get as requestGet} from 'request';
import {ProxyAttribute} from "../meta/proxy/ProxyAttribute";
import {Handler} from "../proxy/Handler";
import {Test} from "../proxy/TestProxy";

type DocumentRef = string


interface PayloadProperties {
  [key: string]: PayloadDefinition;
}

type PayloadType = 'object' | 'string' | 'array' | 'integer'

interface PayloadDefinition {
  description: string;
  type: PayloadType;

  // type could be a reference to another payload (e.g. items)
  $ref: DocumentRef;

  // or it could define properties
  properties: PayloadProperties;

  // if an array, we define the items of a PayloadDefinition type
  items: PayloadDefinition;

  // which of these fields is required
  required: any;
  enum: Array<string>;
}

interface SchemaItems {
  $ref: DocumentRef;
}

interface SchemaDescriptor {
  $ref: DocumentRef;
  type: PayloadType;
  items: SchemaItems;
}

interface ResponseDescriptor {
  description: string;
  schema: SchemaDescriptor;
}

interface MethodResponses {
  [key: string]: ResponseDescriptor
}

interface MethodDescriptor {
  consumes: any;
  description: string;
  operationId: string;
  parameters: any;
  produces: any;
  responses: MethodResponses;
  schemas: any;
  summary: any;
  tags: Array<string>;
}

interface PathInfo {
  [key: string]: MethodDescriptor;
}

interface Paths {
  [key: string]: PathInfo;
}

interface Definitions {
  [key: string]: PayloadDefinition
}

interface APISpecification {
  paths: Paths;
  definitions: any;
}

const processDocumentRef = (ref: DocumentRef) => {
  const refPath = ref as string;
  const components = refPath.split("/");
  return components[components.length - 1];
};

const processObject = (refMap: Map<string, MetaMember>,
                       name: string,
                       required: Array<string>,
                       definition: PayloadDefinition): MetaMember => {
  const properties = definition.properties;
  if (properties) {
    const propertyKeys = Object.keys(properties);

    const fields = propertyKeys.map(propKey => {
      return processDefinition(refMap, propKey, required, properties[propKey]);
    });

    const meta = new ProxyMetaData(fields);
    const builder = new ProxyBuilder(name, meta).scalar();
    return builder.build();
  } else if (definition.$ref) {
    const ref = processDocumentRef(definition.$ref);
    const meta = refMap.get(ref);
    return meta.withName(name);
  }

  return null;
};

const processArray = (refMap: Map<string, MetaMember>,
                      name: string,
                      required: Array<string>,
                      definition: PayloadDefinition): MetaMember => {
  const arrayMember = processObject(refMap, name, required, definition.items);
  if (arrayMember.isProxy)
  // console.log("Array is made of", arrayMember, "objects.");
  return arrayMember
};


const isDefined = (item: any) => {
  return item != null && item != undefined
};

const requiredPropsForDefinition = (definition: PayloadDefinition) => {
  const required = definition.required;
  if (isDefined(required)) {
    return Object.keys(required).map(key => required[key]);
  }

  return []
};

const processDefinition = (refMap: Map<string, MetaMember>,
                           name: string,
                           required: Array<string>,
                           definition: PayloadDefinition): MetaMember => {
  const payloadType = definition.type;
  const isRequired = required.indexOf(name) > -1;

  // console.log("Processing def", name, payloadType);
  switch (payloadType) {
    case 'string': {
      let builder: MetaBuilder = new PrimitiveBuilder(name);
      if (isRequired) {
        builder = builder.required();
      }

      return builder.build();
    }
    case 'integer': {
      let builder: MetaBuilder = new PrimitiveBuilder(name);
      if (isRequired) {
        builder = builder.required();
      }

      return builder.build();
    }
    case 'object': {
      // console.log('Processing object', name);
      const obj = processObject(refMap, name, required, definition);
      // console.log("Obj", name, obj);
      return obj
    }
    case 'array': {
      // console.log('Processing array', name);
      const arr = processArray(refMap,name, required, definition);
      // console.log("Arr", name, arr);
      return arr;
    }
  }
  const enumValues = definition.enum;

  if (enumValues) {
    // console.log("Found enum values:", enumValues,"!");
    return;
  }

};

const processDefinitions = (refMap: Map<string, MetaMember>,
                            definitions: Definitions) => {
  const definitionKeys = Object.keys(definitions);
  // comment this out later
  const filteredDefinitions = definitionKeys.filter(name => name.indexOf("MaterializedPerson") > -1);

  filteredDefinitions.map(definitionName => {
    const definition = definitions[definitionName];
    const required = requiredPropsForDefinition(definition);
    const metaMember = processDefinition(refMap, definitionName, required, definition);
    refMap.set(definitionName, metaMember)
  });
};

const processResponseDescriptor = (responseDescriptor: ResponseDescriptor): string => {
  const schema = responseDescriptor.schema;
  let ref = schema.$ref;
  if (!isDefined(ref)) {
    const items = schema.items;
    if (isDefined(items)) {
      ref = items.$ref
    }
  }

  if (isDefined(ref)) {
    const definitionRef = processDocumentRef(ref);
    // console.log("processResponseDescriptor()", definitionRef);
    return definitionRef;
  }

  return null;
};

const processMethod = (methodName: string,
                       descriptor: MethodDescriptor): string => {
  // console.log('  processMethod', methodName, descriptor);
  if (methodName == 'get') {
    const codes = Object.keys(descriptor.responses);

    const responseOKDescriptor = descriptor.responses['200'];
    if (!isDefined(responseOKDescriptor)) {
      return;
    }

    return processResponseDescriptor(responseOKDescriptor);
  }

  return null;
};

const processEndpoint = (url: string, path: PathInfo): Map<string, string> => {
  // console.log('processEndpoint', url);

  return Object.keys(path).reduce((acc, method)=> {
    acc.set(method, processMethod(method, path[method]));
    return acc;
  }, new Map<string, string>());
};

const processPaths = (paths: Paths) => {
  return Object.keys(paths).reduce((acc, url) => {
    const methodMap = processEndpoint(url, paths[url]);

    acc.set(url, methodMap);
    return acc;
  }, new Map<string, Map<string, string>>());
};

const invertPathInfo = (pathInfo: Map<string, Map<string, string>>): Map<string, Map<string, Array<string>>> => {
  const inverted = new Map<string, Map<string, Array<string>>>();

  const urls = pathInfo.keys();
  for (let url of urls) {
    const methodMap = pathInfo.get(url);

    const methods = methodMap.keys();
    for (let method of methods) {
      const ref = methodMap.get(method);

      let methods = inverted.get(ref);
      if (!isDefined(methods)) {
        inverted.set(ref, new Map<string, Array<string>>());
      }

      methods = inverted.get(ref);

      let endpoints = methods.get(method);
      if (!isDefined(endpoints)) {
        methods.set(method, [])
      }

      endpoints = methods.get(method);
      endpoints.push(url)
    }
  }

  return inverted;
};

const prefix = "http://localhost:9100";

try {
  const doc = safeLoad(fs.readFileSync('src/resources/readside.yaml', 'utf8'));

  const swagger = doc as APISpecification;
  // console.log(doc);

  const pathInfo = processPaths(swagger.paths);
  const inverted = invertPathInfo(pathInfo);

  // console.log(inverted);

  // console.log(pathInfo);

  const definitionMap = new Map<string, MetaMember>();
  processDefinitions(definitionMap, swagger.definitions);

  const definitionNames = Array.from(definitionMap.keys());
  console.log(definitionNames);

  const endpoints = inverted.get('PagedMaterializedPerson');
  // console.log(endpoints);

  const andrew_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik56Y3pSVGxHTXpJeE4wUkNSVEZGUkRnM09VWkVNa1pCUXpVMU1qTTNNVUk0UkRsQ05VTXhOUSJ9.eyJodHRwczovL3ByaW9zQXN5bmMvcGVyc29uSWQiOiI5Nzg4NWRiZC1kOTZlLTQ1NzQtOWIyNC05OWIyNWU0ZTk2YmMiLCJodHRwczovL2F1dGgucHJpbmNpcGxlZC5pby9wZXJzb25JZCI6Ijk3ODg1ZGJkLWQ5NmUtNDU3NC05YjI0LTk5YjI1ZTRlOTZiYyIsImh0dHBzOi8vcHJpb3NBc3luYy90ZW5hbnRJZCI6ImNmMzhjODZmLTZhYjktNDdhMy1iNmZhLWNhZWU0ZmRlNzgwYSIsImh0dHBzOi8vYXV0aC5wcmluY2lwbGVkLmlvL3RlbmFudElkIjoiY2YzOGM4NmYtNmFiOS00N2EzLWI2ZmEtY2FlZTRmZGU3ODBhIiwibmlja25hbWUiOiJhbmRyZXcudHVsaXN6ZXdza2kiLCJuYW1lIjoiYW5kcmV3LnR1bGlzemV3c2tpQHByaW5jaXBsZWQuaW8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvODM4MzZhYTExODAwYjU5NWEwZDQyZmEwNGM5YzY1YzI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZhbi5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOC0wNC0yNVQxOTo0MTowOS4xNjNaIiwiaXNzIjoiaHR0cHM6Ly9wcmlvcy1hc3luY2guYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVhZDczMjI4NjdkZDU2MWFkMGFiMDkxMiIsImF1ZCI6Ik9HYzNqbDA0QXJlVVdnTXVLTG01dThacDFNTnFZb3RSIiwiaWF0IjoxNTI0Njg1MjY5LCJleHAiOjE1ODc3NTcyNjksImF0X2hhc2giOiJtcmhkNFdyTUVjcHlVYVpraWNZOEFRIiwibm9uY2UiOiJaZmFxSnIwa1NWMEJfaTdFTTZoLUFESnkzU2l1VHRfbiJ9.Qyu6kWXUusqjNI9c9zT43arJAY-50XmgXnCDmlbxbMghvUMGM8h08XSSkknXPT-gKPbQsi4lspget0lgqkXudhkpMLkQCsLfEKK725KKSYNxu0V9gSMvl529XRVaPCUW2_p9S7QzI_61q5va0OAgkmfcpzk-Onv_xZesyotzGIQmUXfzfSn7tLgNCKCvECKou5y9uCd55a21aYCtosXT50sbcMdTnOl-FGS3qp3z87TH7yi07yAl6hnl5n5jOnZRFeUBDJ4yXmc5qVJ1ueZULpnOX78uUegYpjNAQiNG-KgyVpVnaest0Y483wLkHRp_wgugjXbLs3LlEOCxQUyJqQ";
  const options = {
    "headers": {
      "Auth-Token": andrew_token
    }
  };
  const uri = prefix + "/api/v1/meeting-tool/people";
  console.log(uri);
  const pagedPeople = definitionMap.get("PagedMaterializedPerson") as ProxyAttribute;
  const meta = pagedPeople.metaData;

  const request = requestGet(uri, options,function (e, r, b) {
    const respObj = JSON.parse(b);
    console.log(pagedPeople);

    const proxy = new Proxy<any>(respObj, new Handler(meta));
    proxy.validate();

    const fail = new Proxy<any>({"hi": "hello"}, new Handler(meta));
    fail.validate();

    // console.log(respObj);
  });

  // definitionNames.forEach(definition => {
  //   const methods = inverted.get(definition);
  //   const getMethods = methods.get('get');
  //
  //   getMethods.forEach(uri => {
  //     const u = prefix + uri;
  //     console.log(u);
  //     const response = requestGet(u);
  //     // console.log(response);
  //   })
  // });
} catch (e) {
  console.log(e);
}
