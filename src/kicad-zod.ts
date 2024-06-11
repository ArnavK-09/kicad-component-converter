import { z } from "zod"

export const point2 = z.tuple([z.number(), z.number()])
export const point3 = z.tuple([z.number(), z.number(), z.number()])
export const point = z.union([point2, point3])

export const attributes_def = z
  .object({
    at: point,
    size: point2,
    layers: z.array(z.string()),
    roundrect_rratio: z.number(),
    uuid: z.string(),
  })
  .partial()

export const property_def = z.object({
  key: z.string(),
  val: z.string(),
  attributes: attributes_def,
})

export const pad_def = z.object({
  name: z.string(),
  pad_type: z.enum(["thru_hole", "smd", "np_thru_hole", "connect"]),
  pad_shape: z.enum([
    "roundrect",
    "circle",
    "rect",
    "oval",
    "trapezoid",
    "custom",
  ]),
  at: point,
  size: point2,
  layers: z.array(z.string()).optional(),
  roundrect_rratio: z.number().optional(),
  chamfer_ratio: z.number().optional(),
  solder_paste_margin: z.number().optional(),
  solder_paste_margin_ratio: z.number().optional(),
  clearance: z.number().optional(),
  zone_connection: z
    .union([
      z.literal(0).describe("Pad is not connect to zone"),
      z.literal(1).describe("Pad is connected to zone using thermal relief"),
      z.literal(2).describe("Pad is connected to zone using solid fill"),
    ])
    .optional(),
  thermal_width: z.number().optional(),
  thermal_gap: z.number().optional(),
  uuid: z.string().optional(),
})

export const drill_def = z.object({
  oval: z.boolean().default(false),
  diameter: z.number(),
  width: z.number().optional(),
  offset: point2.optional(),
})

export const effects_def = z
  .object({
    font: z.object({
      size: point2,
      thickness: z.number().optional(),
    }),
  })
  .partial()

export const fp_text_def = z.object({
  fp_text_type: z.literal("user"),
  text: z.string(),
  at: point,
  layer: z.string(),
  uuid: z.string().optional(),
  effects: effects_def.partial(),
})

export const fp_line = z
  .object({
    start: point2,
    end: point2,
    stroke: z
      .object({
        width: z.number(),
        type: z.string(),
      })
      .optional(),
    width: z.number().optional(),
    layer: z.string(),
    uuid: z.string().optional(),
  })
  // Old kicad versions don't have "stroke"
  .transform((data) => {
    return {
      ...data,
      width: undefined,
      stroke: data.stroke ?? { width: data.width },
    }
  })

export const kicad_mod_json_def = z.object({
  footprint_name: z.string(),
  version: z.string().optional(),
  generator: z.string().optional(),
  generator_version: z.string().optional(),
  layer: z.string(),
  descr: z.string().default(""),
  tags: z.array(z.string()).optional(),
  properties: z.array(property_def),
  fp_lines: z.array(fp_line),
  fp_texts: z.array(fp_text_def),
  pads: z.array(pad_def),
})

export type Point2 = z.infer<typeof point2>
export type Point3 = z.infer<typeof point3>
export type Point = z.infer<typeof point>
export type Attributes = z.infer<typeof attributes_def>
export type Property = z.infer<typeof property_def>
export type Pad = z.infer<typeof pad_def>
export type EffectsObj = z.infer<typeof effects_def>
export type FpText = z.infer<typeof fp_text_def>
export type FpLine = z.infer<typeof fp_line>
export type KicadModJson = z.infer<typeof kicad_mod_json_def>
