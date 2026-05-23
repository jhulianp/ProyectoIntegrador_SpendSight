/**
 * Capa de recursos: traduce entre el shape del frontend (campos en camelCase con datos planos)
 * y el shape del backend (entidades JPA con FKs anidadas).
 *
 * Estrategia:
 *  1. Intentar contra el backend mediante apiCall.
 *  2. Si el backend responde OK -> sincronizar al localStorage y devolver los datos del back.
 *  3. Si el backend no responde -> caer al localStorage (sin romper).
 */

import { apiCall, ENDPOINTS } from './api';
import { loadStorage, saveStorage } from './storage';
import { notify } from './toastBus';

function getSession() {
  try {
    return JSON.parse(localStorage.getItem('ss_session') || 'null');
  } catch {
    return null;
  }
}

function getSuffix() {
  const s = getSession();
  return s ? `_${s.email || s.id}` : '';
}

/** ID estable para Int (Java int max = 2^31 - 1) */
function randomIntId() {
  return Math.floor(Math.random() * 2_000_000_000) + 1;
}

/* ============================================================
 *  CATEGORÍAS    /apispendsight/v1/categorias
 *  Campos back: id, nombre, descripcion, icono, estado, tipo (Ingreso/Egreso),
 *               fechaCreacion, fechaModificacion, usuarioCreacion, usuarioModificacion, usuario(FK)
 * ============================================================ */

function categoriaFEtoBE(cat, session) {
  // En el front se usa "Gasto" / "Ingreso", el back acepta "Ingreso" / "Egreso"
  const tipoBack = cat.tipo === 'Ingreso' ? 'Ingreso' : 'Egreso';
  const now = new Date().toISOString();
  return {
    id: cat.id ?? randomIntId(),
    nombre: cat.nombre,
    descripcion: cat.descripcion || cat.nombre,
    icono: cat.icono || '',
    estado: cat.estado === 'Inactivo' ? 'Inactivo' : 'Activo',
    tipo: tipoBack,
    fechaCreacion: cat.fechaCreacion || now,
    fechaModificacion: now,
    usuarioCreacion: session?.correo || session?.email || 'sistema',
    usuarioModificacion: session?.correo || session?.email || 'sistema',
    usuario: session?.id ? { id: session.id } : null,
  };
}

function categoriaBEtoFE(c) {
  // Mantenemos color del lado del front (el back no lo guarda)
  return {
    id: c.id,
    nombre: c.nombre,
    descripcion: c.descripcion,
    icono: c.icono || 'F',
    tipo: c.tipo === 'Ingreso' ? 'Ingreso' : 'Gasto',
    estado: c.estado,
    color: c.color || '#7c6aff',
    fechaCreacion: c.fechaCreacion,
  };
}

export const categoriasResource = {
  async list() {
    const sfx = getSuffix();
    const r = await apiCall(ENDPOINTS.categorias);
    if (r.ok && Array.isArray(r.data)) {
      const localCache = loadStorage(`ss_categorias${sfx}`, []);
      const merged = r.data.map((c) => {
        const local = localCache.find((x) => x.id === c.id);
        return { ...categoriaBEtoFE(c), color: local?.color || categoriaBEtoFE(c).color };
      });
      saveStorage(`ss_categorias${sfx}`, merged);
      return merged;
    }
    return loadStorage(`ss_categorias${sfx}`, []);
  },

  async save(cat) {
    const sfx = getSuffix();
    const session = getSession();
    const isUpdate = !!cat.id && typeof cat.id === 'number';
    const body = categoriaFEtoBE(cat, session);
    const r = await apiCall(ENDPOINTS.categorias, {
      method: isUpdate ? 'PUT' : 'POST',
      body,
    });
    if (r.ok && r.data) {
      const saved = { ...categoriaBEtoFE(r.data), color: cat.color };
      const list = loadStorage(`ss_categorias${sfx}`, []);
      const idx = list.findIndex((c) => c.id === saved.id);
      if (idx > -1) list[idx] = saved; else list.push(saved);
      saveStorage(`ss_categorias${sfx}`, list);
      return saved;
    }
    // Offline: persistir solo en localStorage
    const saved = { ...cat, id: cat.id || randomIntId(), fechaCreacion: cat.fechaCreacion || new Date().toISOString() };
    const list = loadStorage(`ss_categorias${sfx}`, []);
    const idx = list.findIndex((c) => c.id === saved.id);
    if (idx > -1) list[idx] = saved; else list.push(saved);
    saveStorage(`ss_categorias${sfx}`, list);
    return saved;
  },

  async remove(id) {
    const sfx = getSuffix();
    const r = await apiCall(`${ENDPOINTS.categorias}/${id}`, { method: 'DELETE' });
    if (!r.ok && !r.offline) {
      notify({ message: 'No se pudo eliminar en el backend, se eliminó solo localmente', variant: 'warning' });
    }
    const list = loadStorage(`ss_categorias${sfx}`, []).filter((c) => c.id !== id);
    saveStorage(`ss_categorias${sfx}`, list);
    return true;
  },
};

/* ============================================================
 *  COMERCIOS    /apispendsight/v1/Comercio (¡C mayúscula!)
 *  id es @GeneratedValue IDENTITY -> NO enviar al crear
 *  Tipo enum: Comercio / Servicio
 * ============================================================ */

function comercioFEtoBE(c, session, includeId) {
  const tipo = c.tipo === 'Servicio' ? 'Servicio' : 'Comercio';
  const out = {
    nit: c.nit || `AUTO-${Date.now()}`,
    nombre: c.nombre,
    actividad: c.actividad || 'General',
    contacto: c.contacto || 'sin-contacto@local',
    telefono: c.telefono || '0',
    direccion: c.direccion || 'Sin dirección',
    ciudad: c.ciudad || '',
    pais: c.pais || 'Colombia',
    tipo,
    usuario: session?.id ? { id: session.id } : null,
  };
  if (includeId && c.id) out.id = c.id;
  return out;
}

function comercioBEtoFE(c) {
  return {
    id: c.id,
    nit: c.nit,
    nombre: c.nombre,
    actividad: c.actividad,
    contacto: c.contacto,
    telefono: c.telefono,
    direccion: c.direccion,
    ciudad: c.ciudad,
    pais: c.pais,
    tipo: c.tipo,
    fechaCreacion: c.fechaCreacion || new Date().toISOString(),
  };
}

export const comerciosResource = {
  async list() {
    const sfx = getSuffix();
    const r = await apiCall(ENDPOINTS.comercios);
    if (r.ok && Array.isArray(r.data)) {
      const merged = r.data.map(comercioBEtoFE);
      saveStorage(`ss_comercios${sfx}`, merged);
      return merged;
    }
    return loadStorage(`ss_comercios${sfx}`, []);
  },

  async save(c) {
    const sfx = getSuffix();
    const session = getSession();
    const isUpdate = !!c.id;
    const body = comercioFEtoBE(c, session, isUpdate);
    const r = await apiCall(ENDPOINTS.comercios, {
      method: isUpdate ? 'PUT' : 'POST',
      body,
    });
    if (r.ok && r.data) {
      const saved = comercioBEtoFE(r.data);
      const list = loadStorage(`ss_comercios${sfx}`, []);
      const idx = list.findIndex((x) => x.id === saved.id);
      if (idx > -1) list[idx] = saved; else list.push(saved);
      saveStorage(`ss_comercios${sfx}`, list);
      return saved;
    }
    const saved = { ...c, id: c.id || randomIntId(), fechaCreacion: c.fechaCreacion || new Date().toISOString() };
    const list = loadStorage(`ss_comercios${sfx}`, []);
    const idx = list.findIndex((x) => x.id === saved.id);
    if (idx > -1) list[idx] = saved; else list.push(saved);
    saveStorage(`ss_comercios${sfx}`, list);
    return saved;
  },

  async remove(id) {
    const sfx = getSuffix();
    const r = await apiCall(`${ENDPOINTS.comercios}/${id}`, { method: 'DELETE' });
    if (!r.ok && !r.offline) {
      notify({ message: 'No se pudo eliminar en el backend, se eliminó solo localmente', variant: 'warning' });
    }
    const list = loadStorage(`ss_comercios${sfx}`, []).filter((x) => x.id !== id);
    saveStorage(`ss_comercios${sfx}`, list);
    return true;
  },
};

/* ============================================================
 *  MEDIOS DE PAGO    /api/medios-pago
 *  Sólo expone POST y GET en el back.
 * ============================================================ */

function medioFEtoBE(m, session) {
  return {
    id: m.id ?? randomIntId(),
    nombre: m.nombre,
    franquicia: m.tipo || m.franquicia || 'Otro',
    estado: m.estado === 'Inactivo' ? 'Inactivo' : 'Activo',
    usuario: session?.id ? { id: session.id } : null,
  };
}

function medioBEtoFE(m) {
  return {
    id: m.id,
    nombre: m.nombre,
    tipo: m.franquicia || 'Efectivo',
    franquicia: m.franquicia,
    estado: m.estado,
    color: m.color || '#7c6aff',
    entidad: m.entidad || '',
    ultimosDigitos: m.ultimosDigitos || '',
    fechaCreacion: m.fechaCreacion || new Date().toISOString(),
  };
}

export const mediosPagoResource = {
  async list() {
    const sfx = getSuffix();
    const r = await apiCall(ENDPOINTS.mediosPago);
    if (r.ok && Array.isArray(r.data)) {
      const localCache = loadStorage(`ss_medios_pago${sfx}`, []);
      const merged = r.data.map((m) => {
        const local = localCache.find((x) => x.id === m.id);
        return { ...medioBEtoFE(m), color: local?.color || '#7c6aff', entidad: local?.entidad || '', ultimosDigitos: local?.ultimosDigitos || '' };
      });
      saveStorage(`ss_medios_pago${sfx}`, merged);
      return merged;
    }
    return loadStorage(`ss_medios_pago${sfx}`, []);
  },

  async save(m) {
    const sfx = getSuffix();
    const session = getSession();
    const body = medioFEtoBE(m, session);
    // El backend sólo tiene POST (no PUT). Si es update, igualmente hacemos POST con el mismo ID (JpaRepository.save hace upsert).
    const r = await apiCall(ENDPOINTS.mediosPago, { method: 'POST', body });
    if (r.ok && r.data) {
      const saved = { ...medioBEtoFE(r.data), color: m.color || '#7c6aff', entidad: m.entidad || '', ultimosDigitos: m.ultimosDigitos || '' };
      const list = loadStorage(`ss_medios_pago${sfx}`, []);
      const idx = list.findIndex((x) => x.id === saved.id);
      if (idx > -1) list[idx] = saved; else list.push(saved);
      saveStorage(`ss_medios_pago${sfx}`, list);
      return saved;
    }
    const saved = { ...m, id: m.id || randomIntId(), fechaCreacion: m.fechaCreacion || new Date().toISOString() };
    const list = loadStorage(`ss_medios_pago${sfx}`, []);
    const idx = list.findIndex((x) => x.id === saved.id);
    if (idx > -1) list[idx] = saved; else list.push(saved);
    saveStorage(`ss_medios_pago${sfx}`, list);
    return saved;
  },

  /** El back no expone DELETE -> sólo borramos del localStorage. */
  async remove(id) {
    notify({ message: 'El backend no expone DELETE para medios de pago; se eliminó localmente', variant: 'info' });
    const sfx = getSuffix();
    const list = loadStorage(`ss_medios_pago${sfx}`, []).filter((x) => x.id !== id);
    saveStorage(`ss_medios_pago${sfx}`, list);
    return true;
  },
};

/* ============================================================
 *  GASTOS    /apispendsight/v1/gastos
 *  Campos back: id(Long), descripcion, fecha(LocalDate yyyy-MM-dd), valor(BigDecimal),
 *               imagen, usuario(FK), categoria(FK), comercio(FK), medioPago(FK),
 *               estado(Pendiente/Aprobado/Rechazado), notas
 * ============================================================ */

function mapEstadoGastoFEtoBE(estadoFE) {
  if (estadoFE === 'Activo') return 'Aprobado';
  if (estadoFE === 'Inactivo') return 'Rechazado';
  if (['Pendiente', 'Aprobado', 'Rechazado'].includes(estadoFE)) return estadoFE;
  return 'Pendiente';
}

function mapEstadoGastoBEtoFE(estadoBE) {
  if (estadoBE === 'Aprobado') return 'Activo';
  if (estadoBE === 'Rechazado') return 'Inactivo';
  return 'Activo';
}

function gastoFEtoBE(g, ctx) {
  // ctx: { categorias, comercios, mediosPago, session }
  const cat = ctx.categorias.find((c) => c.nombre === g.categoria);
  const med = ctx.mediosPago.find((m) => m.nombre === g.medioPago);
  const com = ctx.comercios.find((c) => c.nombre === g.comercio);

  return {
    id: g.id ?? randomIntId(),
    descripcion: g.descripcion,
    fecha: g.fecha, // ya viene yyyy-MM-dd
    valor: Number(g.valor) || 0,
    imagen: g.imagen || null,
    usuario: ctx.session?.id ? { id: ctx.session.id } : null,
    categoria: cat?.id ? { id: cat.id } : null,
    comercio: com?.id ? { id: com.id } : null,
    medioPago: med?.id ? { id: med.id } : null,
    estado: mapEstadoGastoFEtoBE(g.estado),
    notas: g.notas || '',
  };
}

function gastoBEtoFE(g, ctx) {
  const cat = g.categoria && ctx.categorias.find((c) => c.id === g.categoria.id);
  const com = g.comercio && ctx.comercios.find((c) => c.id === g.comercio.id);
  const med = g.medioPago && ctx.mediosPago.find((m) => m.id === g.medioPago.id);
  return {
    id: g.id,
    descripcion: g.descripcion,
    fecha: g.fecha,
    valor: Number(g.valor) || 0,
    categoria: cat?.nombre || (g.categoria?.nombre ?? ''),
    comercio: com?.nombre || (g.comercio?.nombre ?? ''),
    medioPago: med?.nombre || (g.medioPago?.nombre ?? ''),
    estado: mapEstadoGastoBEtoFE(g.estado),
    notas: g.notas || '',
  };
}

export const gastosResource = {
  async list(ctx) {
    const sfx = getSuffix();
    const r = await apiCall(ENDPOINTS.gastos);
    if (r.ok && Array.isArray(r.data)) {
      const mapped = r.data.map((g) => gastoBEtoFE(g, ctx));
      saveStorage(`ss_gastos${sfx}`, mapped);
      return mapped;
    }
    return loadStorage(`ss_gastos${sfx}`, []);
  },

  async save(g, ctx) {
    const sfx = getSuffix();
    const isUpdate = !!g.id;
    const body = gastoFEtoBE(g, ctx);
    const path = isUpdate ? `${ENDPOINTS.gastos}/${g.id}` : ENDPOINTS.gastos;
    const r = await apiCall(path, {
      method: isUpdate ? 'PUT' : 'POST',
      body,
    });
    if (r.ok && r.data) {
      const saved = gastoBEtoFE(r.data, ctx);
      const list = loadStorage(`ss_gastos${sfx}`, []);
      const idx = list.findIndex((x) => x.id === saved.id);
      if (idx > -1) list[idx] = saved; else list.push(saved);
      saveStorage(`ss_gastos${sfx}`, list);
      return saved;
    }
    const saved = { ...g, id: g.id || randomIntId(), valor: Number(g.valor) || 0 };
    const list = loadStorage(`ss_gastos${sfx}`, []);
    const idx = list.findIndex((x) => x.id === saved.id);
    if (idx > -1) list[idx] = saved; else list.push(saved);
    saveStorage(`ss_gastos${sfx}`, list);
    return saved;
  },

  async remove(id) {
    const sfx = getSuffix();
    const r = await apiCall(`${ENDPOINTS.gastos}/${id}`, { method: 'DELETE' });
    if (!r.ok && !r.offline) {
      notify({ message: 'No se pudo eliminar en el backend, se eliminó solo localmente', variant: 'warning' });
    }
    const list = loadStorage(`ss_gastos${sfx}`, []).filter((x) => x.id !== id);
    saveStorage(`ss_gastos${sfx}`, list);
    return true;
  },
};
