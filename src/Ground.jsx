import React, { useEffect, useRef } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { BufferAttribute } from "three";
import { usePlane } from "@react-three/cannon";

export const Ground = () => {
  //讓車子掉落在地面
  const [ref] = usePlane(
    () => ({
      type: "Static",
      rotation: [-Math.PI / 2, 0, 0],
    }),
    useRef(null)
  );

  const meshRef = useRef(null);
  const meshRef2 = useRef(null);
  const gridMap = useLoader(
    TextureLoader,
    process.env.PUBLIC_URL + "/textures/grid.png"
  );

  const aoMap = useLoader(
    TextureLoader,
    process.env.PUBLIC_URL + "/textures/ground-ao.png"
  );

  const alphaMap = useLoader(
    TextureLoader,
    process.env.PUBLIC_URL + "/textures/alpha-map.png"
  );

  useEffect(() => {
    gridMap.anisotropy = 16;
  }, [gridMap]);

  useEffect(() => {
    if (!meshRef.current) return;

    var uvs = meshRef.current.geometry.attributes.uv.array;
    meshRef.current.geometry.setAttribute("uv2", new BufferAttribute(uvs, 2));

    var uvs2 = meshRef2.current.geometry.attributes.uv.array;
    meshRef2.current.geometry.setAttribute("uv2", new BufferAttribute(uvs2, 2));
  }, [meshRef.current]);

  return (
    <>
      <mesh
        ref={meshRef2}
        position={[-2.285, -0.01, -1.325]}
        rotation-x={-Math.PI * 0.5}
      >
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          opacity={0.325}
          alphaMap={gridMap}
          transparent={true}
          color={"white"}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={[-2.285, -0.015, -1.325]}
        rotation-x={-Math.PI * 0.5}
        rotation-z={-0.079}
      >
        <circleGeometry args={[6.12, 50]} />
        <MeshReflectorMaterial
          aoMap={aoMap}
          alphaMap={alphaMap}
          transparent={true}
          color={[0.5, 0.5, 0.5]}
          envMapIntensity={0.35}
          metalness={0.05}
          roughness={0.4}
          dithering={true}
          blur={[1024, 512]} // 模糊地面反射 (宽度, 高度)，0 跳过模糊
          mixBlur={3} //模糊和表面粗糙度混合的程度 (默认 = 1)
          mixStrength={30} // 反射强度
          mixContrast={1} // 反射对比度
          resolution={1024} //  Off-buffer 分辨率，越低=越快，越高=更好的质量，更慢
          mirror={0} // 镜像环境，0 = 纹理颜色，1 = 选取环境颜色
          depthScale={0} // 缩放深度因素 (0 = 无深度，默认 = 0)
          minDepthThreshold={0.9} // 深度纹理插值的下限 (默认 = 0)
          maxDepthThreshold={1} //深度纹理插值的上限 (默认 = 0)
          depthToBlurRatioBias={0.25} // 在计算模糊量之前对深度纹理添加偏差因子 [模糊因子 = 模糊纹理 * (深度纹理 + 偏差)]。它接受 0 和 1 之间的值，默认是 0.25。偏差量 > 0 确保模糊纹理不会因为与深度纹理的乘法而太尖锐
          debug={0}
          reflectorOffset={0.02} // 偏移投射反射的虚拟相机。当反射表面距离物体原点一定距离时很有用
        />
      </mesh>
    </>
  );
};
