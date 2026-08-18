---
title:
  th: เปรียบเทียบโครงข่ายประสาทเทียมเชิงลึกสำหรับวินิจฉัยใบพัดเรือด้วยเสียงใต้น้ำ
  en: Comparing Deep Learning Architectures for Hydroacoustic Propeller Fault Diagnosis
date: '2026-08-10'
excerpt:
  th: งานวิจัยของกลุ่มเปรียบเทียบ CNN ห้าสถาปัตยกรรมสำหรับวินิจฉัยใบพัดเรือ USV จากสัญญาณเสียงใต้น้ำ
  en: Group research compares five CNN architectures for USV propeller fault diagnosis from hydroacoustic signals.
body:
  th: |
    งานวิจัยล่าสุดของกลุ่มเปรียบเทียบโครงข่ายประสาทเทียมแบบคอนโวลูชัน (CNN) ห้าสถาปัตยกรรม — AlexNet,
    VGG, ResNet-50, DenseNet-121 และ EfficientNetV2 — สำหรับวินิจฉัยความผิดปกติของใบพัดเรือผิวน้ำ
    ไร้คนขับ (USV) จากสัญญาณเสียงใต้น้ำที่บันทึกด้วยไฮโดรโฟน แทนการตรวจสอบแบบสัมผัสซึ่งทำไม่ได้กับ
    ใบพัดที่จมอยู่ใต้น้ำและปิดผนึกตลอดเวลาใช้งาน

    สัญญาณเสียงถูกแปลงเป็นภาพสเปกโตรแกรมแบบ log-mel ก่อนป้อนเข้าโครงข่ายประสาทเทียม และประเมินผลด้วย
    ตัวชี้วัดมาตรฐานทั้งความแม่นยำและค่าความคลาดเคลื่อน หนึ่งในตัวชี้วัดหลักคือ Root Mean Square Error
    (RMSE) ซึ่งคำนวณจากสูตร:

    ```
    RMSE = sqrt( (1/n) · Σ (yᵢ − ŷᵢ)² )
    ```

    ขั้นตอนการแปลงสัญญาณเสียงดิบให้เป็นสเปกโตรแกรม log-mel ที่ใช้ในงานวิจัยเขียนด้วย Python ดังตัวอย่าง
    สั้น ๆ ต่อไปนี้:

    ```python
    import librosa
    import numpy as np

    def to_log_mel(signal, sr=22050, n_mels=128):
        mel = librosa.feature.melspectrogram(
            y=signal, sr=sr, n_mels=n_mels, fmin=2000, fmax=11000
        )
        return librosa.power_to_db(mel, ref=np.max)
    ```

    ผลการทดลองพบว่าทั้งห้าสถาปัตยกรรมให้ค่า F1-score เฉลี่ยสูงกว่า 99.8% ใกล้เคียงกันมาก ความแตกต่างที่
    มีนัยสำคัญกลับอยู่ที่จำนวนพารามิเตอร์และเวลาประมวลผลต่อหน้าต่างสัญญาณ ทำให้การเลือกสถาปัตยกรรม
    ในทางปฏิบัติควรพิจารณาจากทรัพยากรของอุปกรณ์ปลายทางมากกว่าความแม่นยำเพียงอย่างเดียว
  en: |
    The group's latest research compares five convolutional neural network (CNN) architectures —
    AlexNet, VGG, ResNet-50, DenseNet-121, and EfficientNetV2 — for diagnosing propeller faults in
    unmanned surface vessels (USVs) from hydroacoustic signals recorded with a hydrophone, since
    contact-based inspection is impossible on a propeller that is submerged and sealed during
    operation.

    Each recording is converted into a log-mel spectrogram before being fed into the network, and
    performance is evaluated with standard accuracy and error metrics. One key metric is the Root
    Mean Square Error (RMSE), computed as:

    ```
    RMSE = sqrt( (1/n) · Σ (yᵢ − ŷᵢ)² )
    ```

    The raw-to-spectrogram preprocessing pipeline used in the study is implemented in Python, shown
    in simplified form below:

    ```python
    import librosa
    import numpy as np

    def to_log_mel(signal, sr=22050, n_mels=128):
        mel = librosa.feature.melspectrogram(
            y=signal, sr=sr, n_mels=n_mels, fmin=2000, fmax=11000
        )
        return librosa.power_to_db(mel, ref=np.max)
    ```

    All five architectures achieved mean F1 scores above 99.8%, with little separation in accuracy.
    The meaningful differences instead lie in parameter count and per-window inference time — so in
    practice, architecture choice should be driven by the target platform's compute budget rather
    than accuracy alone.
---
