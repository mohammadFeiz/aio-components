"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AIOSchema = void 0;
var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _agenda = _interopRequireDefault(require("agenda"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } //@ts-ignore
class AIOExpress {
  constructor(_p) {
    _defineProperty(this, "app", void 0);
    _defineProperty(this, "p", void 0);
    _defineProperty(this, "jwt", void 0);
    _defineProperty(this, "AuthRouter", void 0);
    _defineProperty(this, "AuthModel", void 0);
    _defineProperty(this, "models", void 0);
    _defineProperty(this, "routers", void 0);
    _defineProperty(this, "tokenBaseDic", {});
    _defineProperty(this, "tokenLessDic", {});
    _defineProperty(this, "AIOSchemaInstance", new AIOSchema());
    _defineProperty(this, "schemas", {});
    _defineProperty(this, "env", void 0);
    _defineProperty(this, "gcrud", void 0);
    _defineProperty(this, "getRow", void 0);
    _defineProperty(this, "getRows", void 0);
    _defineProperty(this, "addRow", void 0);
    _defineProperty(this, "editRow", void 0);
    _defineProperty(this, "addOrEditRow", void 0);
    _defineProperty(this, "editRows", void 0);
    _defineProperty(this, "removeRow", void 0);
    _defineProperty(this, "removeRows", void 0);
    _defineProperty(this, "getUser", void 0);
    _defineProperty(this, "getUsers", void 0);
    _defineProperty(this, "addUser", void 0);
    _defineProperty(this, "editUser", void 0);
    _defineProperty(this, "editUsers", void 0);
    _defineProperty(this, "removeUser", void 0);
    _defineProperty(this, "removeUsers", void 0);
    _defineProperty(this, "changeUserPassword", void 0);
    _defineProperty(this, "agenda", void 0);
    _defineProperty(this, "getModel", key => this.models[key]);
    _defineProperty(this, "log", (message, color) => {
      if (color === "green") {
        console.log('\x1b[32m%s\x1b[0m', message);
      } else if (color === "yellow") {
        console.log('\x1b[33m%s\x1b[0m', message);
      } else if (color === "red") {
        console.log('\x1b[31m%s\x1b[0m', message);
      } else if (color === "orange") {
        console.log('\x1b[38;5;208m%s\x1b[0m', message);
      } else {
        console.log(message);
      }
    });
    _defineProperty(this, "start", async () => {
      this.app.use((0, _cors.default)());
      this.app.use(_bodyParser.default.json());
      this.app.use((0, _cookieParser.default)());
      this.app.use(_bodyParser.default.urlencoded({
        extended: true
      }));
      this.connectToMongoose();
      if (this.AuthRouter && this.p.auth) {
        this.app.use(this.fixPath(this.p.auth.path), this.AuthRouter);
      }
      // Routes without token
      for (let name in this.tokenLessDic) {
        this.app.use(this.tokenLessDic[name], this.routers[name]);
      }
      // Middleware JWT
      this.app.use(this.jwt);
      // Routes with token
      for (let name in this.tokenBaseDic) {
        const path = this.tokenBaseDic[name];
        const router = this.routers[name];
        this.app.use(path, router);
      }
      await this.agenda.start();
      this.app.listen(this.env.port, () => {
        console.log(`Server running on port ${this.env.port}`);
      });
    });
    _defineProperty(this, "transaction", async callback => {
      const session = await _mongoose.default.startSession();
      session.startTransaction();
      try {
        const result = await callback(session);
        if (typeof result === "string") {
          await session.abortTransaction();
          session.endSession();
          console.error("Callback error:", result);
          return result;
        }
        await session.commitTransaction();
        session.endSession();
        return result;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error.message);
        return error.message;
      }
    });
    _defineProperty(this, "schedule", async p => {
      try {
        const existingJobs = await this.agenda.jobs({
          name: p.jobName
        });
        if (existingJobs.length > 0) {
          const job = existingJobs[0];
          if (job.attrs.data.version === p.version) {
            console.log(`job with name ${p.jobName} and version ${p.version} is already exist.`);
            return;
          } else {
            await this.agenda.cancel({
              name: p.jobName
            });
            console.log(`job with name ${p.jobName} and last version removed.`);
          }
        }
        this.agenda.define(p.jobName, async job => await p.callback());
        const executionDate = new Date(p.callAt);
        await this.agenda.schedule(executionDate, p.jobName, {
          version: p.version
        });
        console.log(`job ${p.jobName} for time ${executionDate} and version ${p.version} scheduled.`);
      } catch (error) {
        console.error(`خطا در زمان‌بندی شغل: ${error.message}`);
      }
    });
    _defineProperty(this, "stopSchedule", async name => {
      try {
        const result = await this.agenda.cancel({
          name
        });
        if (result) {
          console.log(`شغل با نام ${name} با موفقیت حذف شد.`);
        } else {
          console.log(`شغلی با نام ${name} پیدا نشد.`);
        }
      } catch (error) {
        console.error(`خطا در حذف شغل: ${error.message}`);
      }
    });
    _defineProperty(this, "connectToMongoose", () => {
      const url = this.env.mongoUrl;
      _mongoose.default.connect(url).then(() => console.log('MongoDB connected')).catch(err => console.log(err));
    });
    _defineProperty(this, "getTotal", async name => await this.getModel(name).countDocuments({}));
    _defineProperty(this, "getNewPassword", async p => {
      const isMatch = await _bcryptjs.default.compare(p.oldPassword, p.userPassword);
      if (!isMatch) {
        return false;
      }
      const hashedPassword = await _bcryptjs.default.hash(p.newPassword, 10);
      return hashedPassword;
    });
    _defineProperty(this, "initJwt", (req, res, next) => {
      if (!this.p.auth) {
        return;
      }
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          message: 'Access denied. No token provided.',
          success: false
        });
      }
      _jsonwebtoken.default.verify(token, this.env.secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'Invalid token or token is expired.'
          });
        }
        req.user = decoded;
        next();
      });
    });
    _defineProperty(this, "getExpiresIn", () => {
      if (!this.p.auth) {
        return '';
      }
      const {
          tokenTime
        } = this.p.auth,
        {
          unit,
          value
        } = tokenTime;
      return `${value}${unit}`;
    });
    _defineProperty(this, "getSchemaByRefrence", schema => {
      if (typeof schema === 'string') {
        return {
          dif: this.schemas[schema],
          ref: schema
        };
      }
      return {
        dif: schema,
        ref: ''
      };
    });
    _defineProperty(this, "handleAuth", () => {
      if (!this.p.auth) {
        return;
      }
      const {
        registerExeption,
        loginExeption
      } = this.p.auth;
      const {
        dif
      } = this.getSchemaByRefrence(this.p.auth.schema || {});
      const schema = dif;
      const scm = {
        ...schema,
        password: {
          type: 'string',
          required: true
        },
        userName: {
          type: 'string',
          required: true,
          unique: true
        }
      };
      const authSchema = this.AIOSchemaInstance.getSchema(scm);
      authSchema.methods.matchPassword = async function (enteredPassword) {
        return await _bcryptjs.default.compare(enteredPassword, this.password);
      };
      this.AuthModel = _mongoose.default.model(this.p.auth.name, authSchema);
      const registerFn = async (req, res) => {
        if (!this.AuthModel) {
          return res.status(400).json({
            message: 'class error 23423'
          });
        }
        const {
          userName,
          password,
          userProps = {}
        } = req.body;
        try {
          const existingUser = await this.AuthModel.findOne({
            userName
          });
          if (existingUser) {
            return res.status(403).json({
              message: 'User with this username already exists'
            });
          }
          if (!password || !userName) {
            return res.status(403).json({
              message: 'Missing username or password'
            });
          }
          let defModel = {};
          if (schema) {
            defModel = this.AIOSchemaInstance.getDefaultValueBySchema(schema, {
              ...userProps,
              userName,
              password
            });
            const message = this.AIOSchemaInstance.validateObjectBySchema(schema, '', defModel);
            if (typeof message === 'string') {
              return res.status(400).json({
                message,
                success: false
              });
            }
          }
          if (registerExeption) {
            const exep = await registerExeption({
              userName,
              password,
              userProps
            });
            if (exep) {
              if (exep.status) {
                return res.status(exep.status).json({
                  message: exep.message,
                  success: false
                });
              }
              if (exep.userName) {}
            }
          }
          const hashedPassword = await _bcryptjs.default.hash(password, 10);
          const userModel = {
            ...defModel,
            password: hashedPassword,
            userName
          };
          const newUser = new this.AuthModel(userModel);
          await newUser.save();
          return res.status(201).json({
            message: 'User registered successfully',
            user: userModel
          });
        } catch (err) {
          return res.status(500).json({
            message: 'Error registering user',
            error: err.message
          });
        }
      };
      this.AuthRouter.post('/register', registerFn);
      const loginFn = async (req, res) => {
        if (!this.AuthModel) {
          return;
        }
        const {
          userName,
          password
        } = req.body;
        try {
          let user = await this.AuthModel.findOne({
            userName
          });
          if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({
              message: 'Invalid username or password'
            });
          }
          const secretKey = this.env.secretKey;
          const token = _jsonwebtoken.default.sign({
            id: user._id
          }, secretKey, {
            expiresIn: this.getExpiresIn()
          });
          if (loginExeption) {
            const exep = await loginExeption({
              user,
              token
            });
            if (exep) {
              if (exep.status) {
                return res.status(exep.status).json({
                  message: exep.message,
                  success: false
                });
              }
              if (exep.user) {
                let newUser = user.toObject();
                for (let prop in exep.user) {
                  newUser[prop] = exep.user[prop];
                }
                return res.status(200).json({
                  message: 'Login successful',
                  token,
                  user: newUser
                });
              }
            }
          }
          return res.status(200).json({
            message: 'Login successful',
            token,
            user
          });
        } catch (err) {
          return res.status(500).json({
            message: 'Error logging in',
            error: err.message
          });
        }
      };
      this.AuthRouter.post('/login', loginFn);
      this.AuthRouter.get('/checkToken', async (req, res) => {
        if (!this.p.auth) {
          return;
        }
        try {
          var _req$headers$authoriz;
          const token = ((_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1]) || ''; // استخراج توکن از هدر
          _jsonwebtoken.default.verify(token, this.env.secretKey, async (err, decoded) => {
            if (err) {
              return this.setResult({
                res,
                message: 'Token is invalid',
                success: false,
                status: 401
              });
            }
            if (this.AuthModel) {
              const reqUserId = decoded.id;
              const reqUser = await this.getUser({
                id: reqUserId
              });
              if (reqUser === null) {
                return this.setResult({
                  res,
                  message: 'User Not Found',
                  success: false,
                  status: 401
                });
              }
              if (typeof reqUser === 'string') {
                return this.setResult({
                  res,
                  message: reqUser,
                  success: false,
                  status: 401
                });
              }
            }
            return this.setResult({
              res,
              message: 'authorized',
              success: true,
              status: 201
            });
          });
        } catch (err) {
          return this.setResult({
            res,
            status: 500,
            success: false,
            message: err.message
          });
        }
      });
    });
    _defineProperty(this, "addSchema", (name, scm) => {
      this.schemas[name] = scm;
      this.AIOSchemaInstance.schemas = this.schemas;
    });
    _defineProperty(this, "getSchemaDefinition", (schema, entityName) => {
      if (typeof schema === 'string') {
        const scm = this.schemas[schema];
        if (!!scm.type) {
          console.error(`Error in entity ${entityName} . schema is not valid . route schemas cannot get type property`);
        }
        return scm;
      }
      return schema;
    });
    _defineProperty(this, "addEntities", entities => {
      if (this.p.uiDoc) {
        const {
          success,
          result
        } = this.AIOSchemaInstance.generateUIDoc(entities);
        const message = success ? 'generate ui doc was successful!!!' : 'error in generate ui doc!!!';
        const color = success ? 'green' : 'red';
        this.log(message, color);
        this.log(result, 'yellow');
      }
      this.log(this.AIOSchemaInstance.getApiTypes(entities), 'orange');
      for (let prop in entities) {
        this.addEntity(entities[prop], prop);
      }
    });
    _defineProperty(this, "fixPath", (path, queryString) => (path[0] !== '/' ? `/${path}` : path) + (queryString || ''));
    _defineProperty(this, "addEntity", (entity, name) => {
      const {
        schema,
        apis,
        requiredToken = true
      } = entity;
      const dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
      this[dicName][name] = this.fixPath(entity.path || `/${name}`);
      if (schema) {
        try {
          const dif = this.getSchemaDefinition(schema, name);
          const removedIdDif = {};
          for (let prop in dif) {
            if (prop !== 'id') {
              removedIdDif[prop] = dif[prop];
            }
          }
          const entitySchema = this.AIOSchemaInstance.getSchema(removedIdDif);
          const entityModel = _mongoose.default.model(name, entitySchema);
          this.models[name] = entityModel;
        } catch (err) {
          console.error(`Error creating model for entity ${name}:`, err.message);
          return;
        }
      }
      try {
        this.routers[name] = _express.default.Router();
        for (let api of apis) {
          const {
            path,
            method,
            fn,
            queryString
          } = api;
          const url = this.fixPath(path, queryString);
          this.routers[name][method](url, async (req, res) => {
            try {
              const reqUser = await this.getUserByReq(req);
              if (reqUser === null) {
                return this.setResult({
                  res,
                  success: false,
                  message: 'req user not found',
                  status: 401
                });
              }
              let body = {
                ...(req.body || {})
              };
              if (method === 'post' && !api.body) {
                return this.setResult({
                  status: 403,
                  success: false,
                  message: 'missing api.body in backend app',
                  res
                });
              }
              const queryParam = this.processUrl(req);
              if (api.body) {
                let scm = this.schemas[api.body];
                if (!scm) {
                  console.log(`${api.body} in not defined by addSchema`);
                }
                let message = this.AIOSchemaInstance.validateObjectBySchema(scm, '', req.body);
                if (typeof message === 'string') {
                  message = `in request body : ${message}`;
                  return this.setResult({
                    status: 400,
                    success: false,
                    message,
                    res
                  });
                }
              }
              if (typeof reqUser === 'string') {
                return {
                  success: false,
                  message: reqUser,
                  status: 403
                };
              }
              let accessBody;
              if (api.checkAccess) {
                let result = await api.checkAccess({
                  reqUser,
                  body,
                  queryParam
                });
                if (typeof result === 'string') {
                  return res.status(403).json({
                    message: result,
                    success: false
                  });
                } else if (result) {
                  accessBody = result;
                }
              }
              const result = await fn({
                req,
                res,
                reqUser,
                body,
                accessBody,
                queryParam
              });
              return this.setResult({
                ...result,
                res,
                message: result.message || ''
              });
            } catch (err) {
              return res.status(500).json({
                message: err.message,
                success: false
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error creating router for entity ${name}:`, err.message);
      }
    });
    _defineProperty(this, "processUrl", req => {
      if (Object.keys(req.params).length > 0) {
        return req.params;
      }
      if (Object.keys(req.query).length > 0) {
        return req.query;
      }
      return {};
    });
    _defineProperty(this, "setResult", p => {
      return p.res.status(p.status).json({
        message: p.message,
        success: p.success,
        value: p.value
      });
    });
    _defineProperty(this, "getUserByReq", async req => {
      try {
        if (!this.AuthModel) {
          return null;
        }
        const userId = req.user.id;
        const user = await this.AuthModel.findById(userId);
        return user;
      } catch (err) {
        return err.message;
      }
    });
    // mongoose.set('debug', true);
    this.p = _p;
    this.env = {
      mongoUrl: _p.env.mongoUrl,
      secretKey: _p.env.secretKey,
      port: _p.env.port
    };
    this.models = {};
    this.routers = {};
    this.app = (0, _express.default)();
    this.AuthRouter = _express.default.Router();
    this.jwt = this.initJwt;
    if (_p.auth) {
      this.handleAuth();
    }
    this.gcrud = new GCRUD({
      getModel: this.getModel,
      getAuthModel: () => this.AuthModel
    });
    this.getRow = this.gcrud.getRow;
    this.getRows = this.gcrud.getRows;
    this.addRow = this.gcrud.addRow;
    this.editRow = this.gcrud.editRow;
    this.addOrEditRow = this.gcrud.addOrEditRow;
    this.editRows = this.gcrud.editRows;
    this.removeRow = this.gcrud.removeRow;
    this.removeRows = this.gcrud.removeRows;
    this.getUser = async p => await this.getRow({
      ...p,
      entityName: 'auth'
    });
    this.getUsers = async p => await this.getRows({
      ...p,
      entityName: 'auth'
    });
    this.addUser = async p => {
      const newValue = p.newValue;
      const hashedPassword = await _bcryptjs.default.hash(newValue.password, 10);
      newValue.password = hashedPassword;
      const res = await this.addRow({
        ...p,
        newValue,
        entityName: 'auth'
      });
      return typeof res === 'string' ? res : res;
    };
    this.editUser = async p => await this.editRow({
      ...p,
      entityName: 'auth'
    });
    this.editUsers = async p => await this.editRows({
      ...p,
      newValue: p.newValue,
      entityName: 'auth'
    });
    this.removeUser = async p => await this.removeRow({
      ...p,
      entityName: 'auth'
    });
    this.removeUsers = async p => await this.removeRows({
      ...p,
      entityName: 'auth'
    });
    this.changeUserPassword = async p => {
      try {
        const newPasswrod = await this.getNewPassword(p);
        if (newPasswrod === false) {
          return 'old password is not match';
        }
        const newValue = {
          password: newPasswrod
        };
        const res = await this.editUser({
          id: p.userId,
          newValue
        });
        if (typeof res === 'string') {
          return res;
        } else {
          return true;
        }
      } catch (err) {
        return err.message;
      }
    };
    const agenda = new _agenda.default({
      db: {
        address: this.env.mongoUrl
      }
    });
    this.agenda = agenda;
  }
}
var _default = exports.default = AIOExpress;
class GCRUD {
  constructor(_p2) {
    _defineProperty(this, "getModel", void 0);
    _defineProperty(this, "getAuthModel", void 0);
    _defineProperty(this, "getModelByP", async p => p.entityName === 'auth' ? this.getAuthModel() : await this.getModel(p.entityName));
    _defineProperty(this, "fixId", row => {
      if (typeof row === 'object' && !Array.isArray(row) && row !== null) {
        row.id = row._id;
      }
      return row;
    });
    _defineProperty(this, "getRow", async p => {
      try {
        const model = await this.getModelByP(p);
        if (p.id) {
          const res = await model.findById(p.id);
          return this.fixId(res);
        } else if (p.search) {
          const res = await model.findOne(p.search);
          return this.fixId(res);
        } else {
          return `Error in get row: please send search object or id for search`;
        }
      } catch (error) {
        return `Error in get row: ${error.message}`;
      }
    });
    _defineProperty(this, "getRows", async p => {
      try {
        const model = await this.getModelByP(p);
        if (p.ids && p.ids.length > 0) {
          return await model.find({
            _id: {
              $in: p.ids
            }
          });
        }
        if (p.search) {
          const res = await model.find(p.search);
          return res.map(o => this.fixId(o));
        }
        return [];
      } catch (error) {
        return `Error in getRows: ${error.message}`;
      }
    });
    _defineProperty(this, "addRow", async p => {
      try {
        let model, newRecord;
        try {
          model = await this.getModelByP(p);
          newRecord = new model(p.newValue);
        } catch (err) {
          return err.message;
        }
        const param = p.session ? {
          session: p.session
        } : undefined;
        const res = await newRecord.save(param).catch(err => `Error in adding row : ${err}`);
        const result = this.fixId(res);
        return result;
      } catch (error) {
        return `Error in adding row: ${error.message}`;
      }
    });
    _defineProperty(this, "editRow", async p => {
      try {
        const model = await this.getModelByP(p);
        const exist = await this.getRow(p);
        if (exist === null) {
          return 'Record not found';
        }
        if (typeof exist === 'string') {
          return exist;
        }
        for (let prop in p.newValue) {
          if (prop === 'id' || prop === '_id') {
            continue;
          }
          exist[prop] = p.newValue[prop];
        }
        const updatedRecord = await model.findByIdAndUpdate(exist.id, exist, {
          new: true,
          session: p.session
        });
        if (!updatedRecord) {
          return 'Record not found';
        }
        return this.fixId(updatedRecord);
      } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
      }
    });
    _defineProperty(this, "addOrEditRow", async p => {
      try {
        const model = await this.getModelByP(p);
        let existingRecord = await this.getRow({
          entityName: p.entityName,
          search: p.search,
          id: p.id
        });
        if (typeof existingRecord === 'string') {
          return existingRecord;
        }
        if (existingRecord !== null) {
          const updatedRecord = await model.findByIdAndUpdate(existingRecord.id, p.newValue, {
            new: true,
            session: p.session
          });
          return this.fixId(updatedRecord);
        } else {
          const newRecord = new model(p.newValue);
          await newRecord.save();
          return this.fixId(newRecord);
        }
      } catch (error) {
        return `Error adding or updating record: ${error.message}`;
      }
    });
    _defineProperty(this, "editRows", async p => {
      try {
        const model = await this.getModelByP(p);
        let query;
        if (p.ids && p.ids.length > 0) {
          query = {
            _id: {
              $in: p.ids
            }
          };
        } else {
          query = p.search;
        }
        const result = await model.updateMany(query, {
          $set: p.newValue
        }, {
          session: p.session
        });
        if (result.modifiedCount === 0) {
          return 'No records found to update';
        }
        return result.modifiedCount; // تعداد رکوردهای ویرایش شده
      } catch (error) {
        throw new Error(`Error updating records: ${error.message}`);
      }
    });
    _defineProperty(this, "removeRow", async p => {
      try {
        const model = await this.getModelByP(p);
        let query;
        if (p.id) {
          query = {
            _id: p.id
          };
        } else if (p.search) {
          query = p.search;
        } else {
          return 'No criteria provided for deletion';
        }
        const deletedRecord = await await model.findOneAndDelete(query, {
          session: p.session
        });
        if (!deletedRecord) {
          return null;
        }
        return this.fixId(deletedRecord);
      } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
      }
    });
    _defineProperty(this, "removeRows", async p => {
      try {
        const model = await this.getModelByP(p);
        let query;
        if (p.ids && p.ids.length > 0) {
          query = {
            _id: {
              $in: p.ids
            }
          };
        } else {
          query = p.search;
        }
        const result = await model.deleteMany(query, {
          session: p.session
        });
        if (result.deletedCount === 0) {
          return 'No records found to delete';
        }
        return result.deletedCount;
      } catch (error) {
        throw new Error(`Error deleting records: ${error.message}`);
      }
    });
    this.getModel = _p2.getModel;
    this.getAuthModel = _p2.getAuthModel;
  }
}
class AIOSchema {
  constructor() {
    _defineProperty(this, "schemas", {});
    _defineProperty(this, "getSchemaByRefrence", schema => {
      if (typeof schema === 'string') {
        return {
          dif: this.schemas[schema],
          ref: schema
        };
      }
      return {
        dif: schema,
        ref: ''
      };
    });
    _defineProperty(this, "isSchemaRowSchema", schemaDefinitionOption => {
      const {
        dif
      } = this.getSchemaByRefrence(schemaDefinitionOption);
      return !dif.type;
    });
    _defineProperty(this, "isSchemaRowMap", schemaDefinitionOption => {
      const {
        dif
      } = this.getSchemaByRefrence(schemaDefinitionOption);
      return !!dif.of;
    });
    _defineProperty(this, "getSchemaType", type => {
      if (type === 'string') return String;else if (type === 'number') return Number;else if (type === 'boolean') return Boolean;else if (type === 'null') return;else if (type === 'true') return Boolean;else if (type === 'false') return Boolean;else if (type === 'date') return Date;else if (type === 'map') return Map;else if (typeof type === 'string') {
        const schema = this.schemas[type];
        if (!schema) {
          return;
        }
        return this.getSchemaType(schema);
      } else if (Array.isArray(type)) {
        return [this.getSchemaType(type[0])];
      } else {
        return this.getSchema(type);
      }
      ;
    });
    _defineProperty(this, "getSchema", scm => {
      const {
        dif
      } = this.getSchemaByRefrence(scm);
      const schemaDefinition = dif;
      try {
        const fields = {};
        Object.keys(schemaDefinition).forEach(fieldKey => {
          let h = this.getSchemaByRefrence(schemaDefinition[fieldKey]);
          const dif = h.dif;
          if (!dif.type) {
            console.error(`missing schemaDefinitionOption.type`);
            console.error('schemaDefinition is:', scm);
            console.error('field is:', fieldKey);
          }
          const type = this.getSchemaType(dif.type);
          if (type === undefined) {
            console.log(`schema.type:'${dif.type}' is not valid for mongooseSchema`);
            return;
          }
          let mongooseSchema = {
            type,
            required: !!dif.required,
            unique: !!dif.unique
          };
          if (dif.def !== undefined) mongooseSchema.default = dif.def;
          if (dif.ref) mongooseSchema.ref = dif.ref;
          if (dif.enum) mongooseSchema.enum = dif.enum;
          if (dif.minLength) mongooseSchema.minLength = dif.minLength;
          if (dif.maxLength) mongooseSchema.maxLength = dif.maxLength;
          if (dif.min) mongooseSchema.min = dif.min;
          if (dif.max) mongooseSchema.max = dif.max;
          if (dif.index !== undefined) mongooseSchema.index = dif.index;
          if (dif.validate) {
            mongooseSchema.validate = {
              validator: dif.validate,
              message: dif.errorMessage || 'Validation failed'
            };
          }
          fields[fieldKey] = mongooseSchema;
        });
        const schema = new _mongoose.default.Schema(fields, {
          timestamps: true,
          toJSON: {
            virtuals: true
          },
          toObject: {
            virtuals: true
          }
        });
        return schema;
      } catch (err) {
        console.error(`generate schema error by schemaDefinition =>`, err.message);
        console.error(`schemaDefinition is => ${schemaDefinition}`);
        console.error(`defined schema is => ${scm}`);
        return new _mongoose.default.Schema({}, {
          timestamps: true,
          toJSON: {
            virtuals: true
          },
          toObject: {
            virtuals: true
          }
        });
      }
    });
    _defineProperty(this, "validateObjectBySchema", (scm, key, value) => {
      if (typeof scm === 'string') {
        return 'error 56452435345';
      }
      if (scm.type) {
        return this.validateValueBySchemaDefinitionOption(scm, key, value);
      } else {
        return this.validateObjectBySchemaDefinition(scm, key, value);
      }
    });
    _defineProperty(this, "validateObjectBySchemaDefinition", (scm, parentKey, obj) => {
      const {
        dif
      } = this.getSchemaByRefrence(scm);
      const schemaDefinition = dif;
      if (typeof schemaDefinition === 'string') {
        return 'error 5423456';
      }
      const keys = Object.keys(schemaDefinition);
      for (const key of keys) {
        if (key === 'organization') {
          debugger;
        }
        const {
          dif
        } = this.getSchemaByRefrence(schemaDefinition[key]);
        const scm = dif;
        const value = obj[key];
        const res = this.validateObjectBySchema(scm, `${parentKey}.${key}`, value);
        if (typeof res === 'string') {
          return res;
        }
      }
      return undefined;
    });
    _defineProperty(this, "validateValueBySchemaDefinitionOption", (sdo, key, value) => {
      const {
        dif
      } = this.getSchemaByRefrence(sdo);
      sdo = dif;
      if (Array.isArray(sdo.type)) {
        if (!Array.isArray(value)) {
          return `property "${key}" should be an array`;
        }
        return this.validateObjectBySchema({
          type: sdo.type[0]
        }, key + '[0]', value[0]);
      }
      //اگر required true بود ولی مقدار نداشت
      if (sdo.required && (value === undefined || value === null)) {
        return `property "${key}" is required but not provided`;
      }
      //اگر نوع ردیف آبجکت سازنده ی اسکیما map بود
      if (sdo.type === 'map') {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return `property "${key}" should be an object (Map)`;
        }
        if (!sdo.of) {
          return `missing of property but type is map in schemaDefinitionOption by key = ${key}`;
        }
        for (const mapKey in value) {
          return this.validateObjectBySchema({
            type: sdo.of,
            required: true
          }, key, value[mapKey]);
        }
      }
      //اگر تایپ ردیف آبجکت سازنده ی اسکیما خود یک اسکیما بود
      if (typeof sdo.type === 'object') {
        if (sdo.type.type) {
          return 'invalid schema. schema.type.type detected';
        }
        return this.validateObjectBySchema(sdo.type, `${key}.type`, value || {});
      }
      if (value !== undefined && !this.isValidType(value, sdo.type)) {
        return `property "${key}" is not of type ${sdo.type}, value is ${JSON.stringify(value, null, 3)}`;
      }
    });
    _defineProperty(this, "isValidType", (value, schemaType) => {
      switch (schemaType) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number';
        case 'boolean':
          return typeof value === 'boolean';
        case 'false':
          return value === false;
        case 'null':
          return value === null;
        case 'true':
          return value === true;
        case 'date':
          return value instanceof Date;
        default:
          return true;
        // انواع دیگر داده‌ها (مثل any) را قبول می‌کنیم
      }
    });
    _defineProperty(this, "getDefaultValueBySchema", (scm, value) => {
      if (typeof scm === 'string') {
        return {};
      }
      if (scm.type) {
        return this.getDefaultValueBySchemaDefinitionOption(scm, value);
      } else {
        return this.getDefaultObjectBySchemaDefinition(scm, value);
      }
    });
    _defineProperty(this, "getDefaultObjectBySchemaDefinition", (scm, obj) => {
      const {
        dif
      } = this.getSchemaByRefrence(scm);
      const schemaDefinition = dif;
      const result = {
        ...obj
      };
      Object.keys(schemaDefinition).forEach(key => {
        const h = schemaDefinition[key];
        if (typeof h === 'string') {
          return obj;
        } //chizi ke az this.schemas mikhoonim ghatan string nist
        result[key] = this.getDefaultValueBySchema(h, result[key]);
      });
      return result;
    });
    _defineProperty(this, "getDefaultValueBySchemaDefinitionOption", (sdo, value) => {
      const {
        dif
      } = this.getSchemaByRefrence(sdo);
      sdo = dif;
      if (value === undefined) {
        if (sdo.required === true) {
          return sdo.def;
        }
      } else {
        return value;
      }
    });
    _defineProperty(this, "schemaDefinitionToTS", scm => {
      const {
        dif
      } = this.getSchemaByRefrence(scm);
      const schemaDefinition = dif;
      let res = `{\n`;
      const schemaKeys = Object.keys(schemaDefinition);
      for (let i = 0; i < schemaKeys.length; i++) {
        const key = schemaKeys[i];
        const h = schemaDefinition[key];
        const {
          dif,
          ref
        } = this.getSchemaByRefrence(h);
        if (ref) {
          res += `   ${key}: ${ref},\n`;
        } else {
          const sdo = dif;
          const {
            success,
            result
          } = this.schemaDefinitionOptionToTS(sdo);
          if (!success) {
            return {
              success: false,
              result
            };
          }
          res += `   ${key}: ${result},\n`;
        }
      }
      res += `}`;
      return {
        success: true,
        result: res
      };
    });
    _defineProperty(this, "simpleTypeToTS", (type, required) => {
      const getRes = result => ({
        success: true,
        result: `${result}${required ? '' : ' | undefined'}`
      });
      switch (type) {
        case 'string':
          return getRes('string');
        case 'number':
          return getRes('number');
        case 'boolean':
          return getRes('boolean');
        case 'null':
          return getRes('null');
        case 'true':
          return getRes('true');
        case 'false':
          return getRes('false');
        case 'date':
          return getRes('Date');
        default:
          return getRes('any');
      }
    });
    _defineProperty(this, "schemaToTS", scm => {
      const {
        dif,
        ref
      } = this.getSchemaByRefrence(scm);
      let res;
      if (ref) {
        res = {
          success: true,
          result: ref
        };
      } else if (dif.type) {
        res = this.schemaDefinitionOptionToTS(scm);
      } else {
        res = this.schemaDefinitionToTS(scm);
      }
      if (res.success === true) {
        res.result = res.result.replace(/'null'/g, 'null').replace(/"null"/g, 'null');
      }
      return res;
    });
    _defineProperty(this, "schemaDefinitionOptionToTS", SDO => {
      const {
        dif
      } = this.getSchemaByRefrence(SDO);
      const sdo = dif;
      if (Array.isArray(sdo.type)) {
        const {
          dif,
          ref
        } = this.getSchemaByRefrence(sdo.type[0]);
        if (ref) {
          return {
            success: true,
            result: `(${ref})[]`
          };
        }
        const {
          success,
          result
        } = this.schemaDefinitionOptionToTS({
          type: dif,
          required: true
        });
        if (!success) {
          return {
            success: false,
            result
          };
        }
        return {
          success: true,
          result: `(${result})[]`
        };
      }
      if (typeof sdo.type === 'object') {
        if (sdo.type.type) {
          return {
            success: false,
            result: 'invalid schema. schema.type.type detected'
          };
        }
        return this.schemaDefinitionToTS(sdo.type);
      }
      if (sdo.type === 'map') {
        if (!sdo.of) {
          const message = `in this schema definition option type is map but missing of property as schema definition. schema definition row is`;
          return {
            success: false,
            result: `${message} => ${JSON.stringify(sdo, null, 3)}`
          };
        }
        const {
          dif,
          ref
        } = this.getSchemaByRefrence(sdo.of);
        if (ref) {
          return {
            success: true,
            result: `{[key: string]: ${ref}${sdo.required ? '' : ' | undefined'}}`
          };
        }
        const {
          success,
          result
        } = this.schemaDefinitionOptionToTS({
          type: dif,
          required: true
        });
        if (!success) {
          return {
            success: false,
            result
          };
        }
        return {
          success: true,
          result: `{[key: string]: ${result}${sdo.required ? '' : ' | undefined'}}`
        };
      }
      if (Array.isArray(sdo.enum)) {
        //notice enum can be schema
        let errors = [];
        let result = sdo.enum.map(value => {
          if (typeof value === 'string') {
            return `'${value}'`;
          }
          if (typeof value === 'number') {
            return `${value}`;
          }
          const {
            success,
            result
          } = this.schemaToTS(value);
          if (success === false) {
            errors.push(result);
          }
          return result;
        }).join(' | ');
        if (errors.length) {
          return {
            success: false,
            result: errors.toString()
          };
        }
        if (!sdo.required) {
          result = `(${result}) | undefined`;
        }
        return {
          success: true,
          result
        };
      }
      if (['string', 'number', 'boolean', 'date', 'true', 'false', 'null'].indexOf(sdo.type) !== -1) {
        return this.simpleTypeToTS(sdo.type, !!sdo.required);
      } else {
        return this.schemaToTS(sdo.type);
      }
    });
    _defineProperty(this, "bodyParamToString", api => {
      let res = '';
      if (api.body) {
        let scm = this.schemas[api.body];
        if (!scm) {
          return {
            result: `${api.body} is not defined by addSchema`,
            success: false
          };
        }
        res = `body:${api.body}`;
      }
      if (api.queryString) {
        res += `${res ? ',' : ''}queryParam:{[key:string]:string} | string`;
      }
      return {
        success: true,
        result: res
      };
    });
    _defineProperty(this, "getReturnTypeString", api => {
      return {
        success: true,
        result: `:Promise<(${api.successResultType}) | (${api.errorResultType})>`
      };
    });
    _defineProperty(this, "getUrlString", (name, path, queryString) => {
      if (!queryString) {
        return `const url = ${"`${this.base_url}"}${name}${path}${"`"}`;
      }
      return `const url = ${"`${this.base_url}"}${name}${path}${"${this.getUrlQueryParam(queryParam)}"}${"`"}`;
    });
    _defineProperty(this, "getMethodsString", entities => {
      let res = '';
      for (let name in entities) {
        const {
          apis
        } = entities[name];
        for (let api of apis) {
          const {
            method,
            configStr,
            description,
            queryString
          } = api;
          const path = api.path[0] !== '/' ? '/' + api.path : api.path;
          const apiName = name + path.replace(/\//g, '_');
          const bodyParamString = this.bodyParamToString(api);
          if (!bodyParamString.success) {
            return {
              success: false,
              result: bodyParamString.result
            };
          }
          const returnTypeString = this.getReturnTypeString(api);
          if (!returnTypeString.success) {
            return {
              success: false,
              result: returnTypeString.result
            };
          }
          res += `
    ${apiName} = async (${bodyParamString.result})${returnTypeString.result}=>{
        ${this.getUrlString(name, path, queryString)}
        return await this.request({
            url,description:"${description}",method:"${method}",${!api.body ? '' : `body,`}\n
            ${configStr}
        })
    }
                `;
        }
      }
      return {
        success: true,
        result: res
      };
    });
    _defineProperty(this, "getInterfaces", () => {
      let res = '';
      for (let prop in this.schemas) {
        const scm = this.schemas[prop];
        if (typeof scm === 'string') {
          continue;
        }
        const {
          success,
          result
        } = this.schemaToTS(scm);
        if (!success) {
          return {
            success: false,
            result
          };
        }
        res += `
export type ${prop} = ${result};
            `;
      }
      return {
        success: true,
        result: res
      };
    });
    _defineProperty(this, "getApiTypes", entities => {
      let res = '';
      res += `
express app api types:


        `;
      res += `
type I_response<T> = { status: number, success: boolean, message?: string, value: T }
            `;
      for (let name in entities) {
        const {
          apis,
          path
        } = entities[name];
        for (let api of apis) {
          let {
            path,
            successResultType,
            errorResultType
          } = api;
          if (path[0] === '/') {
            path = path.slice(1, path.length);
          }
          res += `
export type API_${name}_${path} = I_response<(${successResultType}) | (${errorResultType})>;
            `;
        }
      }
      return res;
    });
    _defineProperty(this, "generateUIDoc", entities => {
      const methodsString = this.getMethodsString(entities);
      if (!methodsString.success) {
        return {
          success: false,
          result: methodsString.result
        };
      }
      const interfaces = this.getInterfaces();
      if (!interfaces.success) {
        return {
          success: false,
          result: interfaces.result
        };
      }
      const result = `
import AIOApis from "aio-apis";
type I_APIS = {base_url:string,token:string,logout:()=>void}
${interfaces.result}
export default class APIS {
    request: AIOApis['request'];
    base_url:string;
    constructor(p:I_APIS) {
        this.base_url = p.base_url;
        const inst = new AIOApis({
            id: 'cardexsuperadminapis', token:p.token, lang: 'fa',
            onCatch: (response) => {
                try{return response.response.data.message}
                catch{return response.messge}
            },
            isSuccess: (response) => {
                if(response.status === 401 || response.data.status === 401){p.logout()}
                else if (response.data.success === false) { return response.data.message }
            }
        })
        this.request = inst.request;
    }
    getUrlQueryParam = (params?: { [key: string]: string } | string) => {
        if (typeof params === 'string') { return ${"`/${params}`"}; }
        else if (typeof params === 'object' && params !== null) {
            const queryString = Object.keys(params)
                .map(key => ${"`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`"})
                .join('&');
            return ${"`?${queryString}`"};
        }
        return '';
    }
${methodsString.result}
}
        `;
      return {
        success: true,
        result
      };
    });
  }
}

//tanzimate replica set
//1- tavaghofe mongodb => power shel as administrator => net stop MongoDB
//2- dar mahale path\to\mongodb\Server\7.0\bin\mongod.cfg khotoote zir ro zafe kon
//replication:
//replSetName: "rs0"
//3- agar error cannot open file daryaft shod bayad 
//rooye folder rightclick=>properties=>security=>full controll tik bezani rooye hame ye halat ha
//4- power shell as administrator => net start MongoDB
//5- mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"
//6- dar terminale vscode varede mohite mongosh sho => mongosh
//7- dar mongosh => mongod --replSet "rs0"
//8- dar mongosh => rs.initiate()
exports.AIOSchema = AIOSchema;